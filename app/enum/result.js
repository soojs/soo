/**
 * 响应成功码
 * @type {Enum}
 */
const Success = Object.freeze({
  OK: 0,
});

/**
 * 响应失败码
 * @type {Enum}
 */
const Failure = Object.freeze({
  USER_AUTH_FAIL: 100401,
  USER_NOT_FOUND: 100404,
  USER_CONFLICT: 100403,
  POST_CONFLICT: 200403,
});

module.exports = { Success, Failure };
