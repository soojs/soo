const co = require('co')
const bcrypt = require('bcrypt')

const Const = require('../common/const')
const ServiceError = require('../common/ServiceError')
const models = require('../models')

exports._createUser = function *(user) {
    let existed = yield this.getUserByUsername(user.username)
    if (existed && existed.id > 0) {
        throw new ServiceError(Const.ERROR.USER_EXIST, 'User existed')
    }
    let encryptedPassword = yield bcrypt.hash(user.password, 10)
    let transientUser = {
        username: user.username,
        password: encryptedPassword,
        salt: '',
        nickname: user.nickname,
        roles: user.roles,
        createBy: user.createBy
    }
    let persistentUser = yield models.UserAccount.create(transientUser)
    user = persistentUser.get({ plain: true })

    delete user.password
    delete user.salt
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
    
    return persistentUser
}