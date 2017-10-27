const co = require('co')

const services = require('../../services')
const UserService = services.UserService

exports.getByUsername = co.wrap(function* (ctx, next) {
    let user = yield UserService.getUserByUsername(ctx.params.username)
    ctx.body = user
    yield next()
})

exports.create = co.wrap(function* (ctx, next) {
    let body = ctx.request.body
    if (!body.username || !body.password || !body.nickname) {
        ctx.throw(400, 'Username or password or nickname cannot be empty')
    }
    let user = yield UserService.createUser(body)
    ctx.body = user
    yield next()
})
