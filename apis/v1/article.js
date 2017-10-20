const co = require('co')
const services = require('../../services')

const ArticleService = services.ArticleService

const list = exports.list = co.wrap(function* (ctx, next) {
    let page = yield ArticleService.getArticles({
        limit: ctx.request.query.limit,
        offset: ctx.request.query.offset
    })
    ctx.body = page
    yield next()
})

const getById = exports.getById = co.wrap(function* (ctx, next) {
    let article = yield ArticleService.getArticleById(ctx.params.articleId)
    ctx.body = article
    yield next()
})

const create = exports.create = co.wrap(function* (ctx, next) {
    let body = ctx.request.body
    if (!body.title || !body.content) {
        ctx.throw(400, 'Title or content cannot be empty')
    }
    let article = yield ArticleService.createArticle(body)
    ctx.body = article
    yield next()
})

const update = exports.update = co.wrap(function* (ctx, next) {
    let body = ctx.request.body
    if (!body.title || !body.content) {
        ctx.throw(400, 'Title or content cannot be empty')
    }
    let article = yield ArticleService.updateArticle(body)
    ctx.body = article
    yield next()
})

exports.register = function (router) {
    router.get('/api/v1/article/', list)
    router.get('/api/v1/article/:articleId', getById)
    router.put('/api/v1/article', update)
    router.post('/api/v1/article', create)
}
