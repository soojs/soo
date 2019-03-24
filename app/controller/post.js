const { PostService } = require('../service');
const Const = require('../common/const');

exports.rss = async (ctx) => {
  const list = await PostService.getPostsByRss();
  await ctx
    .render('rss', {
      rows: list,
      currentTime: new Date().getTime(),
    })
    // reset header for xml response
    .then(() => {
      ctx.type = 'text/xml';
    });
};

exports.about = async (ctx) => {
  const post = await PostService.getByPermalink('about', Const.POST_FMT.HTML);
  if (post === null) {
    ctx.throw(404);
  }

  // 设置页面导航选中状态
  if (post.permalink === 'about') {
    ctx.state.module = 'about';
  }
  await ctx.render('post', { post, page: {} });
};

exports.archives = async (ctx) => {
  const page = await PostService.getPosts({
    limit: 1000, // 这里假设不会超过1000篇文章，很多了吧，超过就翻页吧呵呵
    offset: 0,
  }, undefined, { includeUser: false });
  const groups = {};
  if (page && page.rows) {
    page.rows.forEach((item) => {
      const year = new Date(item.publishAt).getFullYear();
      groups[year] = groups[year] || [];
      groups[year].push(item);
    });
  }
  const keys = Object.keys(groups).sort((a, b) => b - a);
  // 设置页面导航选中状态
  ctx.state.module = 'archives';
  await ctx.render('archives', { groups, keys });
};

exports.list = async (ctx) => {
  const p = parseInt(ctx.request.query.p, 10) || 1;
  const pageLimit = 10;
  const pageNumber = Math.max(p, 1);
  const pageOffset = (pageNumber - 1) * pageLimit;
  const page = await PostService.getPosts({
    limit: pageLimit,
    offset: pageOffset,
  });

  const pageData = {};
  const pageCount = Math.floor(((page.count + pageLimit) - 1) / pageLimit);
  if (p > 1) {
    pageData.prev = { link: `/?p=${p - 1}`, label: '上一页' };
  }
  if (p < pageCount) {
    pageData.next = { link: `/?p=${p + 1}`, label: '下一页' };
  }
  // 设置页面导航选中状态
  ctx.state.module = 'index';
  await ctx.render('index', { count: page.count, rows: page.rows, page: pageData });
};

exports.getById = async (ctx) => {
  const post = await PostService.getById(ctx.params.id, Const.POST_FMT.HTML);
  if (post === null) {
    ctx.throw(404);
  }

  const pageData = {};
  if (post.prev) {
    pageData.prev = { link: `/post/${post.prev.id}`, label: '上一篇', title: post.prev.title };
  }
  if (post.next) {
    pageData.next = { link: `/post/${post.next.id}`, label: '下一篇', title: post.next.title };
  }
  await ctx.render('post', { post, page: pageData });
};

exports.getByPermalink = async (ctx) => {
  const post = await PostService.getByPermalink(ctx.params.permalink, Const.POST_FMT.HTML);
  if (post === null) {
    ctx.throw(404);
  }

  const pageData = {};
  if (post.prev) {
    pageData.prev = { link: `/post/${post.prev.id}`, label: '上一篇', title: post.prev.title };
  }
  if (post.next) {
    pageData.next = { link: `/post/${post.next.id}`, label: '下一篇', title: post.next.title };
  }
  await ctx.render('post', { post, page: pageData });
};
