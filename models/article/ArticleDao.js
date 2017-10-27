const db = require('../sequelize')

/**
 * 新建文章对象
 * @param {Object} article
 * @return {Object} created article
 */
exports.create = function *(article) {
    article.status = 0
    article.createTime = Date.now()
    article.updateTime = article.createTime

    let result = yield db.Article.create(article)
    return result
}
/**
 * 更新文章对象
 * @param {Object} article
 * @return {Object} updated article
 */
exports.update = function *(article) {
    let existArticle = yield db.Article.findById(article.id)

    if (existArticle != null) {
        existArticle.tags = article.tags
        existArticle.title = article.title
        existArticle.summary = article.summary
        existArticle.updateTime = Date.now()
    }

    return existArticle
}
/**
 * 删除文章对象
 * @param {Number} articleId
 * @return {Object} deleted article
 */
exports.remove = function *(articleId) {
    let article = yield db.Article.findById(articleId)

    if (article != null) {
        article.destroy()
    }

    return article
}