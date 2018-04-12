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
    createAt: Date.now(),
  });

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
  existed.updateAt = Date.now();
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

exports.publish = async (id, publishBy) => {
  const existed = await models.Post.findById(id);
  if (existed === null) {
    return existed;
  }
  existed.status = Const.POST_STATUS.RELEASE;
  existed.publishBy = publishBy;
  existed.publishAt = Date.now();
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

exports.getPosts = async ({ plimit, poffset }, includeUser = true) => {
  const options = {
    limit: Math.min(plimit || 10, 10),
    offset: Math.max(poffset || 0, 0),
    where: { status: Const.POST_STATUS.RELEASE },
    order: [['publishAt', 'DESC']],
    include: [],
  };
  if (includeUser) {
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
