const co = require('co')

const services = require('../../services')
const PostService = services.PostService

exports.list = co.wrap(function* (ctx, next) {
    let page = yield PostService.getPosts({
        limit: ctx.request.query.limit,
        offset: ctx.request.query.offset
    })
    ctx.body = page
    yield next()
})

exports.getById = co.wrap(function* (ctx, next) {
    let post = yield PostService.getPostById(ctx.params.id)
    ctx.body = post
    yield next()
})

exports.create = co.wrap(function* (ctx, next) {
    let body = ctx.request.body
    if (!body.title || !body.content) {
        ctx.throw(400, 'Title or content cannot be empty')
    }
    let post = yield PostService.createPost(body)
    ctx.body = post
    yield next()
})

exports.update = co.wrap(function* (ctx, next) {
    let body = ctx.request.body
    if (!body.title || !body.content) {
        ctx.throw(400, 'Title or content cannot be empty')
    }
    let post = yield PostService.updatePost(body)
    ctx.body = post
    yield next()
})
