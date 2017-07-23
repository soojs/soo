const db = require('../sequelize')

/**
 * 新建文章内容对象
 * @param {Object} articleContent
 * @return {Object} created articleContent
 */
exports.create = function *(articleContent) {
    let result = yield db.ArticleContent.create(articleContent)
    return result
}