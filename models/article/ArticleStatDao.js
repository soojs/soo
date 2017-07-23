const db = require('../sequelize')

/**
 * 新建文章统计对象
 * @param {Object} articleStat
 * @return {Object} created articleStat
 */
exports.create = function *(articleStat) {
    let result = yield db.ArticleStat.create(articleStat)
    return result
}