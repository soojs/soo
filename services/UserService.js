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
    let encryptedPassword = yield bcrypt.hash(user.password, Const.SALT_ROUNDS)
    let transientUser = {
        username: user.username,
        password: encryptedPassword,
        salt: '',
        nickname: user.nickname || user.username,
        roles: user.roles || Const.ROLES.ANONY,
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
    
    return persistentUser === null ? null : persistentUser.get({ plain: true })
}
/**
 * 更新用户密码，如果密码一致，更新成功并返回用户信息，否则返回`null`
 * @param {String} username
 * @param {String} oldPlainPassword
 * @param {String} newPlainPassword
 * @return {Object}
 * @throws {ServiceError} Const.ERROR.USER_NOT_FOUND
 */
exports.updatePassword = function *(username, oldPlainPassword, newPlainPassword) {
    let persistentUser = yield models.UserAccount.findOne({
        where: {
            username: username
        }
    })
    if (persistentUser === null) {
        throw new ServiceError(Const.ERROR.USER_NOT_FOUND, 'User not found')
    }
    let res = yield bcrypt.compare(oldPlainPassword, persistentUser.get('password'))
    if (res) {
        encryptedPassword = yield bcrypt.hash(newPlainPassword, Const.SALT_ROUNDS)
        persistentUser.set({ password: encryptedPassword })
        persistentUser.save()
        return persistentUser.get({ plain: true })
    }
    return null
}
/**
 * 检查用户密码，如果密码一致，返回用户信息，否则返回`null`
 * @param {String} username
 * @param {String} plainPassword
 * @return {Object}
 * @throws {ServiceError} Const.ERROR.USER_NOT_FOUND
 */
exports.checkPassword = function *(username, plainPassword) {
    let persistentUser = yield models.UserAccount.findOne({
        where: {
            username: username
        }
    })
    if (persistentUser === null) {
        throw new ServiceError(Const.ERROR.USER_NOT_FOUND, 'User not found')
    }
    let res = yield bcrypt.compare(plainPassword, persistentUser.get('password'))
    if (res) {
        let user = persistentUser.get({ plain: true })
        delete user.password
        delete user.salt
        return user
    }
    return null
}