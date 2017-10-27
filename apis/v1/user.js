const co = require('co')

const Const = require('../../common/const')
const services = require('../../services')
const UserService = services.UserService

exports.getByUsername = co.wrap(function* (ctx, next) {
    let user = yield UserService.getUserByUsername(ctx.params.username)
    ctx.body = user || {}
    yield next()
})

exports.create = co.wrap(function* (ctx, next) {
    let body = ctx.request.body
    if (!body.username || !body.password || !body.nickname) {
        ctx.throw(400, 'Username or password or nickname cannot be empty')
    }
    try {
        let user = yield UserService.createUser(body)
        ctx.body = {
            code: Const.SUCCESS,
            data: user || {}
        }
    } catch (e) {
        ctx.body = {
            code: e.code,
            message: e.message
        }
    }
    yield next()
})
