const db = require('../sequelize')
const co = require('co')

/**
 * 新建文章
 * @param {Object} article
 * @return {Object} created article
 */
exports.create = function *(article) {
    article.status = 0
    article.create_time = Date.now()
    article.update_time = article.create_time

    let result = yield db.Article.create(article)
    return result
}

exports.update = function *(article) {

}

let article = {
    tags: 'test',
    title: 'test',
    summary: 'test',
    status: 0
}

co(exports.create(article))
