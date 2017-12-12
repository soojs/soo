const { PostService } = require('../services');
const Const = require('../common/const');

exports.list = async (ctx) => {
  const pageLimit = 10;
  const pageNumber = Math.max(parseInt(ctx.request.query.p, 10) || 1, 1);
  const pageOffset = (pageNumber - 1) * pageLimit;
  const page = await PostService.getPosts({
    limit: pageLimit,
    offset: pageOffset,
  });

  await ctx.render('index', { count: page.count, rows: page.rows });
};

exports.getById = async (ctx) => {
  const post = await PostService.getById(ctx.params.id, Const.POST_FMT.HTML);
  if (post === null) {
    ctx.throw(404);
  }
  await ctx.render('post', { post });
};

exports.getByPermalink = async (ctx) => {
  const post = await PostService.getByPermalink(ctx.params.permalink, Const.POST_FMT.HTML);
  if (post === null) {
    ctx.throw(404);
  }

  await ctx.render('post', { post });
};
