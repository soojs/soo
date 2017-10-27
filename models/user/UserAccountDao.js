const db = require('../sequelize')

/**
 * 新建用户
 * @param {Object} user
 * @return {Object} created user
 */
exports.create = function *(user) {
    user.createTime = Date.now()
    user.updateTime = user.createTime

    let result = yield db.User.create(user)
    return result
}
/**
 * 更新用户
 * @param {Object} user
 * @return {Object} updated user
 */
exports.update = function *(user) {
    let existedUser = yield db.User.findById(user.id)

    if (existedUser !== null) {
        existedUser.nickname = user.nickname
        existedUser.updateTime = Date.now()

        return yield existedUser.save()
    }

    return existedUser
}
/**
 * 删除用户
 * @param {Number} userId
 * @return {Object} deleted user
 */
exports.remove = function *(userId) {
    let user = yield db.User.findById(userId)
    
    if (user != null) {
        user.destroy()
    }

    return user
}