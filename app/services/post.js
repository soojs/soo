const _ = require('lodash');
const Const = require('../common/const');
const helper = require('../lib/helper');
const models = require('../models');

exports.ncreate = async function ncreate(post) {
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

exports.create = async function create(post) {
  const created = await models.client.transaction(() => this.ncreate(post));
  return created.get({ plain: true });
};

exports.nupdate = async function nupdate(id, post) {
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

exports.update = async function update(id, post) {
  const updated = await models.client.transaction(() => this.nupdate(id, post));
  return updated.get({ plain: true });
};

exports.publish = async function publish(id, publishBy) {
  const existed = await models.Post.findById(id);
  if (existed === null) {
    return existed;
  }
  existed.status = Const.POST_STATUS.RELEASE;
  existed.publishBy = publishBy;
  existed.publishAt = Date.now();
  const updated = await existed.save();
  return updated.get({ plain: true });
};

exports.nremove = async function nremove(id) {
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

exports.remove = async function remove(id) {
  const result = await models.client.transaction(() => this.nremove(id));
  return result;
};

exports.getById = async function getById(id, type = Const.POST_FMT.HTML) {
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

  return existed.get({ plain: true });
};

exports.getByPermalink = async function getByPermalink(permalink, type = Const.POST_FMT.HTML) {
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

  return existed.get({ plain: true });
};

exports.getPosts = async function getPosts(pageArg) {
  let { limit, offset } = pageArg;
  limit = Math.min(limit || 10, 10);
  offset = Math.max(offset || 0, 0);
  const page = await models.Post.findAndCountAll({
    limit,
    offset,
    include: [{
      model: models.User,
      as: 'user',
      attributes: ['id', 'nickname'],
    }],
  });

  const posts = { count: 0, rows: [] };
  if (page) {
    posts.count = page.count;
    if (page.rows) {
      page.rows.forEach((item) => {
        posts.rows.push(item.get({ plain: true }));
      });
    }
  }
  return posts;
};
