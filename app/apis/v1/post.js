const { PostService } = require('../../services');
const { getApiResult } = require('../../lib/helper');

exports.list = async (ctx) => {
  const { limit, offset } = ctx.request.query;
  const page = await PostService.getPosts({ limit, offset });
  ctx.body = getApiResult(page);
};

exports.getById = async (ctx) => {
  const post = await PostService.getById(ctx.params.id, ctx.query.type);
  ctx.body = getApiResult(post);
};

exports.create = async (ctx) => {
  const { title, content } = ctx.request.body;
  if (!title || !content) {
    ctx.throw(400, 'Title or content cannot be empty');
  }
  const post = await PostService.create({ title, content });
  ctx.body = getApiResult(post);
};

exports.update = async (ctx) => {
  const { title, content } = ctx.request.body;
  if (!title || !content) {
    ctx.throw(400, 'Title or content cannot be empty');
  }
  const post = await PostService.update(ctx.params.id, { title, content });
  ctx.body = getApiResult(post);
};
