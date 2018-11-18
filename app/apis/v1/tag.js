const { TagService } = require('../../services');
const { getApiResult } = require('../../lib/helper');

exports.create = async (ctx) => {
  const { postId, tags } = ctx.request.body;
  if (!postId || !tags || !tags.length) {
    ctx.throw(400, 'PostId or tags cannot be empty');
  }
  const post = await TagService.batchCreate(ctx.request.body);
  ctx.body = getApiResult(post);
};

exports.list = async (ctx) => {
  const { limit, offset } = ctx.request.query;
  const list = await TagService.getReadableTags({ limit, offset });
  ctx.body = getApiResult(list);
};
