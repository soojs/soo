/**
 * 业务错误码
 */
exports.ERROR = {
  USER_EXIST: 100403,
  USER_NOT_FOUND: 100404,
  USER_AUTH_FAIL: 100401,
  POST_EXIST: 200403,
};
/**
 * 业务成功码
 */
exports.SUCCESS = 0;
/**
 * 用户角色
 */
exports.ROLES = {
  USER: 'user',
  ANONY: 'anony',
  ADMIN: 'admin',
};
/**
 * 文章格式
 */
exports.POST_FMT = {
  MARKDOWN: 0,
  HTML: 1,
};
/**
 * 文章状态
 */
exports.POST_STATUS = {
  DRAFT: 0,
  RELEASE: 1,
};
/**
 * 用户状态
 */
exports.USER_STATUS = {
  NORMAL: 0,
  BLACKLIST: -1,
};
/**
 * 密码盐轮
 */
exports.SALT_ROUNDS = 10;
