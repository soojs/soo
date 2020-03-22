/**
 * 用户角色
 * @type {Enum}
 */
const Role = Object.freeze({
  USER: 'user',
  ANONY: 'anony',
  ADMIN: 'admin',
});

/**
 * 用户状态
 * @type {Enum}
 */
const Status = Object.freeze({
  NORMAL: 0,
  BLACKLIST: -1,
});

module.exports = { Role, Status };
