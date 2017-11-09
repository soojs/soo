/**
 * 业务错误码
 */
exports.ERROR =  {
    USER_EXIST: 100403,
    USER_NOT_FOUND: 100404,
    USER_AUTH_FAIL: 100401
}
/**
 * 业务成功码
 */
exports.SUCCESS = 0
/**
 * 用户角色
 */
exports.ROLES = {
    USER: 'user',
    ANONY: 'anony',
    ADMIN: 'admin'
}
/**
 * 密码盐轮
 */
exports.SALT_ROUNDS = 10