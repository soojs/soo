const co = require('co')

const models = require('../models')

exports._createUser = function *(user) {
    let transientUser = {
        username: user.username,
        password: user.password,
        salt: user.salt,
        nickname: user.nickname,
        roles: user.roles,
        createBy: article.createBy
    }
    let persistentUser = yield models.UserAccount.create(transientUser)
    user = persistentUser.get({ plain: true })

    return user
}
/**
 * 新建用户
 * @param {Object} user
 * @return {Object}
 */
exports.createUser = function *(user) {
    let created = yield models.client.transaction((t) => {
        return co(this._createUser(user))
    })

    return created
}
/**
 * 查询用户（根据用户名）
 * @param {String} username
 * @return {Object}
 */
exports.getUserByUsername = function *(username) {
    let persistentUser = yield models.UserAccount.findOne({
        where: {
            username: username
        },
        attributes: ['id', 'username', 'nickname', 'createAt', 'updateAt']
    })
    
    return persistentUser || {}
}