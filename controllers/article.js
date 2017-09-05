const render = require('../lib/render')
const services = require('../services')

const list = exports.list = function *(next) {
    let page = yield services.ArticleService.getArticles({
        limit: this.params.limit, 
        offset: this.params.offset
    })

    let n = this.session.views || 0
    this.session.views += 1
    page.views = this.session.views
    this.body = yield render('list', page)
    yield next
}

exports.register = function (router) {
    router.get('/', list)
}