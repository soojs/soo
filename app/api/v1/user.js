const { UserService } = require('../../service');
const { getApiResult } = require('../../lib/helper');
const Const = require('../../common/const');

exports.list = async (ctx) => {
  const { limit, offset } = ctx.request.query;
  const page = await UserService.getUsers({ limit, offset }, null);
  ctx.body = getApiResult(page);
};

exports.getByUsername = async (ctx) => {
  const user = await UserService.getByUsername(ctx.params.username);
  ctx.body = getApiResult(user);
};

exports.create = async (ctx) => {
  const { username, password, nickname } = ctx.request.body;
  if (!username || !password || !nickname) {
    ctx.throw(400, 'Username or password or nickname cannot be empty');
  }
  try {
    const user = await UserService.create(ctx.request.body);
    ctx.body = getApiResult(user);
  } catch (e) {
    ctx.body = getApiResult(e.message, e.code);
  }
};

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    ctx.throw(400, 'Username or password cannot be empty');
  }
  try {
    const user = await UserService.checkPassword(username, password);
    if (user) {
      ctx.session.user = {
        uid: user.id,
        username: user.username,
        nickname: user.nickname,
      };
      ctx.session.authenticated = true;
      ctx.body = getApiResult(user);
    } else {
      ctx.body = getApiResult(null, Const.ERROR.USER_AUTH_FAIL);
    }
  } catch (e) {
    ctx.body = getApiResult(e.message, e.code);
  }
};
