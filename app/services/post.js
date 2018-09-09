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

  const mdContent = {
    postId: created.id,
    content: post.content,
    type: Const.POST_FMT.MARKDOWN,
  };
  const createdMdContent = await models.PostContent.create(mdContent);
  if (createdMdContent) {
    const contents = [];
    contents.push(createdMdContent);
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
    /* eslint-disable no-param-reassign */
    contents.forEach((item) => {
      if (item.type === Const.POST_FMT.MARKDOWN) {
        item.content = post.content;
      } else if (item.type === Const.POST_FMT.HTML) {
        item.content = helper.markdown2html(post.content);
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

exports.npublish = async (id) => {
  const existed = await models.Post.findById(id, {
    include: [{
      model: models.PostContent,
      as: 'contents',
      where: { type: Const.POST_FMT.MARKDOWN },
    }],
  });
  if (existed === null) {
    return existed;
  }
  existed.status = Const.POST_STATUS.RELEASE;
  existed.publishAt = _.now();
  const updated = await existed.save();

  // 从`create`过程移过来，即在未发布之前，是不需要这些数据的，仅仅保存内容主体即可，
  // 等正式发布后，就会有这些额外的辅助信息，避免每次草率的草稿创建与保存操作带来的大量读写；
  // 第一版的设计是所有相关的数据都一起创建，虽然针对博客这种写少读多的业务可以这么干，
  // 但是还是可以用这种方式优化设计
  const meta = {
    postId: updated.id,
    like: 0,
    comment: 0,
    pageview: 0,
  };
  const htmlContnet = {
    postId: updated.id,
    content: helper.markdown2html(existed.content),
    type: Const.POST_FMT.HTML,
  };
  const [createdMeta, createdHtmlContent] = await Promise.all([
    models.PostMeta.create(meta),
    models.PostContent.create(htmlContnet),
  ]);
  if (createdMeta) {
    updated.meta = createdMeta;
  }
  if (createdHtmlContent) {
    const contents = [];
    contents.push(createdHtmlContent);
    updated.contents = contents;
  }
  return updated;
};

exports.publish = async (id) => {
  const updated = await models.client.transaction(() => this.npublish(id));
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
    await models.PostMeta.destroy({
      where: { postId: id },
    });
  }
  return result;
};

exports.remove = async (id) => {
  const result = await models.client.transaction(() => this.nremove(id));
  return result;
};

/**
 * 查询详情
 * @param {string} key 过滤字段名，目前只有id和permalink
 * @param {string} value 过滤字段值
 * @param {number} contentType 要获取的内容类型
 */
exports.get = async (key, value, contentType = Const.POST_FMT.HTML) => {
  const options = {
    include: [{
      model: models.User,
      as: 'user',
      attributes: ['id', 'nickname'],
    }, {
      model: models.PostMeta,
      as: 'meta',
    }],
  };
  let existed = null;
  if (key === 'id') {
    existed = await models.Post.findById(value, options);
  } else {
    options.where = { permalink: value };
    existed = await models.Post.findOne(options);
  }
  if (existed) {
    // 不能关联查询，否则如果查询html类型的内容会查不到数据(inner join)
    const contents = await models.PostContent.findAll({
      where: { postId: existed.id, type: contentType },
    });
    existed.contents = contents;
  }
  // 只有已经发布的才有pageview
  if (existed && existed.status === Const.POST_STATUS.RELEASE) {
    await models.PostMeta.increment('pageview', {
      by: 1,
      where: { postId: existed.id },
    });
  }
  return existed;
};
/**
 * 根据ID获取详情
 * @param {string} id 主键
 * @param {number} contentType 要获取的内容类型
 */
exports.getById = async (id, contentType = Const.POST_FMT.HTML) => {
  const existed = await this.get('id', id, contentType);
  return existed;
};
/**
 * 根据永久链接获取详情
 * @param {String} permalink 永久链接
 * @param {Number} contentType 要获取的内容类型
 */
exports.getByPermalink = async (permalink, contentType = Const.POST_FMT.HTML) => {
  const existed = await this.get('permalink', permalink, contentType);
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
  includes = { includeUser: true },
) => {
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
/**
 * 输出RSS信息
 * @param {boolean} includeUser 是否包含用户信息
 * @param {boolean} includeContents 是否包含内容
 */
exports.getPostsByRss = async (
  includeUser = false,
  includeContents = true,
) => {
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
