const co = require('co')

const services = require('../services')
const ArticleService = services.ArticleService

exports.list = co.wrap(function* (ctx, next) {
    let pageLimit = 10
    let pageNumber = Math.max(parseInt(ctx.request.query.p) || 1, 1)
    let pageOffset = (pageNumber - 1) * pageLimit
    let page = yield services.ArticleService.getArticles({
        limit: pageLimit, 
        offset: pageOffset
    })
    yield ctx.render('index', {
        count: page.count,
        rows: page.rows
    })
})

exports.getById = co.wrap(function* (ctx, next) {
    let article = yield ArticleService.getArticleById(ctx.params.id)
    yield ctx.render('article', {
        post: article
    })
})
