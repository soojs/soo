const _ = require('lodash');
const Const = require('../common/const');
const ServiceError = require('../common/ServiceError');
const helper = require('../lib/helper');
const models = require('../models');

exports.ncreate = async (post) => {
  const created = await models.Post.create({
    tags: post.tags,
    desc: post.desc,
    title: post.title,
    summary: helper.extractSummary(post.content),
    permalink: post.permalink,
    status: Const.POST_STATUS.DRAFT,
    createBy: post.createBy,
    createAt: _.now(),
  });

  // TODO 这里的逻辑应该和标签逻辑们，全部移到发布功能里去，
  //      即在未发布之前，是不需要这些数据的，仅仅保存内容主体即可，
  //      等正式发布后，就会有这些额外的辅助信息，避免每次草率的
  //      草稿创建与保存操作带来的大量读写；
  //      第一版的设计是所有相关的数据都一起创建，虽然针对博客这种写少读多的业务可以这么干，
  //      但是还是可以用这种方式优化设计
  const stat = {
    postId: created.id,
    comment: 0,
    pageview: 0,
  };
  const mdContent = {
    postId: created.id,
    content: post.content,
    type: Const.POST_FMT.MARKDOWN,
  };
  const htmlContnet = {
    postId: created.id,
    content: helper.markdown2html(post.content),
    type: Const.POST_FMT.HTML,
  };
  const [createdStat, createdMdContent, createdHtmlContent] = await Promise.all([
    models.PostStat.create(stat),
    models.PostContent.create(mdContent),
    models.PostContent.create(htmlContnet),
  ]);
  if (createdStat) {
    created.stat = createdStat;
  }
  if (createdMdContent || createdHtmlContent) {
    const contents = [];
    if (createdMdContent) {
      contents.push(createdMdContent);
    }
    if (createdHtmlContent) {
      contents.push(createdHtmlContent);
    }
    created.contents = contents;
  }
  return created;
};

exports.create = async (post) => {
  // 如果设置了永久链接，要判断唯一性
  if (post.permalink) {
    const existed = await models.Post.findOne({
      where: { permalink: post.permalink },
    });
    if (existed) {
      throw new ServiceError(Const.ERROR.POST_EXIST, 'Post existed');
    }
  }
  const created = await models.client.transaction(() => this.ncreate(post));
  return created;
};

exports.nupdate = async (id, post) => {
  const existed = await models.Post.findById(id);
  if (existed === null) {
    return existed;
  }
  existed.tags = post.tags;
  existed.desc = post.desc;
  existed.title = post.title;
  existed.summary = helper.extractSummary(post.content);
  existed.permalink = post.permalink;
  existed.updateBy = post.updateBy;
  existed.updateAt = _.now();
  const updated = await existed.save();

  const { Op } = models.client;
  const contents = await models.PostContent.findAll({
    where: {
      postId: { [Op.eq]: updated.id },
      type: { [Op.in]: [Const.POST_FMT.MARKDOWN, Const.POST_FMT.HTML] },
    },
  });
  if (contents && contents.length > 0) {
    contents.forEach((item) => {
      if (item.type === Const.POST_FMT.MARKDOWN) {
        item.content = post.content; // eslint-disable-line no-param-reassign
      } else if (item.type === Const.POST_FMT.HTML) {
        item.content = helper.markdown2html(post.content); // eslint-disable-line no-param-reassign
      }
    });
    await Promise.all(_.map(contents, item => item.save()));
  }

  return updated;
};

exports.update = async (id, post) => {
  const updated = await models.client.transaction(() => this.nupdate(id, post));
  return updated;
};

exports.publish = async (id) => {
  const existed = await models.Post.findById(id);
  if (existed === null) {
    return existed;
  }
  existed.status = Const.POST_STATUS.RELEASE;
  // TODO 好像没这个字段？
  // existed.publishBy = publishBy;
  existed.publishAt = _.now();
  const updated = await existed.save();
  return updated;
};

exports.nremove = async (id) => {
  const result = await models.Post.destroy({
    where: { id },
  });
  if (result > 0) {
    await models.PostContent.destroy({
      where: { postId: id },
    });
    await models.PostStat.destroy({
      where: { postId: id },
    });
  }
  return result;
};

exports.remove = async (id) => {
  const result = await models.client.transaction(() => this.nremove(id));
  return result;
};

exports.getById = async (id, type = Const.POST_FMT.HTML) => {
  const existed = await models.Post.findById(id, {
    include: [{
      model: models.User,
      as: 'user',
      attributes: ['id', 'nickname'],
    }, {
      model: models.PostContent,
      as: 'contents',
      where: { type },
    }, {
      model: models.PostStat,
      as: 'stat',
    }],
  });

  if (existed) {
    await models.PostStat.increment('pageview', {
      by: 1,
      where: { postId: existed.id },
    });
  }

  return existed;
};

exports.getByPermalink = async (permalink, type = Const.POST_FMT.HTML) => {
  const existed = await models.Post.findOne({
    include: [{
      model: models.User,
      as: 'user',
      attributes: ['id', 'nickname'],
    }, {
      model: models.PostContent,
      as: 'contents',
      where: { type },
    }, {
      model: models.PostStat,
      as: 'stat',
    }],
    where: { permalink },
  });

  if (existed) {
    await models.PostStat.increment('pageview', {
      by: 1,
      where: { postId: existed.id },
    });
  }

  return existed;
};

/**
 * 分页获取post列表
 * @param {object} param0 分页参数：`{plimit: 10, poffset: 0}`
 * @param {object} filters 过滤参数：`{status: 0|1}`
 * @param {object} includes 关联对象：`{includeUser: true|false}`
 * @return {object} `{count:10, rows:[]}`
 */
exports.getPosts = async (
  { plimit, poffset },
  filters = { status: Const.POST_STATUS.RELEASE },
  includes = { includeUser: true }) => {
  const options = {
    limit: Math.min(plimit || 10, 10),
    offset: Math.max(poffset || 0, 0),
    order: [['publishAt', 'DESC']],
    include: [],
  };
  if (filters) {
    options.where = {};
    if (filters.status) {
      options.where.status = filters.status;
    }
  }
  if (includes && includes.includeUser) {
    options.include.push({
      model: models.User,
      as: 'user',
      attributes: ['id', 'nickname'],
    });
  }
  const page = await models.Post.findAndCountAll(options);
  return page;
};

exports.getPostsByRss = async (includeUser = false, includeContents = true) => {
  const options = {
    limit: 20,
    offset: 0,
    where: { status: Const.POST_STATUS.RELEASE },
    order: [[models.client.literal('publishAt DESC')]],
    distinct: true,
    include: [],
  };
  if (includeUser) {
    options.include.push({
      model: models.User,
      as: 'user',
      attributes: ['id', 'nickname'],
    });
  }
  if (includeContents) {
    options.include.push({
      model: models.PostContent,
      as: 'contents',
      where: { type: Const.POST_FMT.HTML },
    });
  }
  const list = await models.Post.findAll(options);
  return list;
};
