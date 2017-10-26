const co = require('co')
const util = require('../lib/util')

const services = require('../services')
const ArticleService = services.ArticleService

const list = exports.list = co.wrap(function* (ctx, next) {
    let pageLimit = 10
    let pageNumber = Math.max(parseInt(ctx.request.query.p) || 1, 1)
    let pageOffset = (pageNumber - 1) * pageLimit
    let page = yield services.ArticleService.getArticles({
        limit: pageLimit, 
        offset: pageOffset
    })
    yield ctx.render('index.ejs', {
        count: page.count,
        rows: page.rows,
        timeFormat: util.timeFormat
    })
})

const getById = exports.getById = co.wrap(function* (ctx, next) {
    let article = yield ArticleService.getArticleById(ctx.params.articleId)
    yield ctx.render('article.ejs', {
        post: article,
        timeFormat: util.timeFormat
    })
})

exports.register = function (router) {
    router.all('/', list)
    router.all('/article/:articleId', getById)
}