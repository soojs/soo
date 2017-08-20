const parse = require('co-body')
const services = require('../../services')

const list = exports.list = function *(next) {
    let page = yield services.ArticleService.getArticles({
        limit: this.params.limit, 
        offset: this.params.offset
    })

    this.body = page
    yield next
}

const getById = exports.getById = function *(next) {
    let article = yield services.ArticleService.getArticleById(this.params.articleId)

    this.body = article
    yield next
}

const create = exports.create = function *(next) {
    let body = yield parse(this, { limit: '100kb' })
    if (!body.title || !body.content) {
        this.throw(400, 'Title or content cannot be empty')
    }
    let article = yield services.ArticleService.createArticle(body)

    this.body = article
    yield next
}

const update = exports.update = function *(next) {
    let body = yield parse(this, { limit: '100kb' })
    if (!body.title || !body.content) {
        this.throw(400, 'Title or content cannot be empty')
    }
    let article = yield services.ArticleService.updateArticle(body)

    this.body = article
    yield next
}

exports.register = function (router) {
    router.get('/api/v1/article/', list)
    router.get('/api/v1/article/:articleId', getById)
    router.put('/api/v1/article', update)
    router.post('/api/v1/article', create)
}
