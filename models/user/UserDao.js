const db = require('../sequelize')
const co = require('co')

/**
 * 新建用户
 * @param {Object} user
 * @return {Object} created user
 */
exports.create = function *(user) {
    user.create_time = Date.now()
    user.update_time = user.create_time

    let result = yield db.User.create(user)
    console.log(JSON.stringify(result))
    return result
}
/**
 * 更新用户
 * @param {Object} user
 * @return {Object} updated user
 */
exports.update = function *(user) {
    let existedUser = yield db.User.findById(user.id)
    // console.log(existedUser)
    if (existedUser === null)
        throw new Error('User does not exist')
    
    existedUser.nickname = user.nickname
    existedUser.update_time = Date.now()

    let result = yield existedUser.save()
    console.log(JSON.stringify(result))
    return result
}

co(exports.update({
    id: '1492696107',
    username: 'test' + Math.random(),
    password: 'qa1234',
    salt: '...',
    nickname: '哈哈哈'
}))

// let testUser = db.User.build({
//     username: 'test' + Math.random(),
//     password: 'qa1234',
//     salt: '...',
//     nickname: 'test',
//     roles: 'user',
//     create_by: 'linh',
//     update_by: 'linh',
//     create_time: Date.now(),
//     update_time: Date.now()
// })

// testUser
//     .save()
//     .then((savedUser) => {
//         let updateNickname = '测试' + savedUser.get('id')
//         console.log(savedUser.get({ plain: true }))
//         savedUser.nickname = updateNickname
//         return savedUser.save()
//     })
//     .then((savedUser) => {
//         console.log(savedUser.get({ plain: true }))
//     })
