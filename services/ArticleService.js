const co = require('co')
const _  = require('lodash')

const models = require('../models')

/**
 * 摘要生成算法
 * @param {String} content
 * @return {String}
 */
function _extractSummary(content) {
    if (!content) {
        return ''
    }
    let size = Math.min(content.length, 500)
    return content.substring(0, size)
}

/**
 * 新建文章
 * @param {Object} article
 * @return {Object}
 */
exports.createArticle2Old = function (article) {
    if (article === null || !article.content) {
        throw new Error('Article or article content cannot be empty')
    }

    return models.client.transaction((t) => {
        let now = Date.now()
        let transientArticle = {
            tags: article.tags,
            title: article.title,
            summary: _extractSummary(article.content),
            createBy: article.createBy,
            status: 0,
            createTime: now,
            updateTime: now
        }

        return models.Article
            .create(transientArticle)
            .then((persistentArticle) => {
                let transientContent = {
                    articleId: persistentArticle.id,
                    content: article.content
                }
                let transientStat = {
                    articleId: persistentArticle.id,
                    comment: 0,
                    pageview: 0
                }

                return Promise
                    .all([
                        models.ArticleStat.create(transientStat),
                        models.ArticleContent.create(transientContent)
                    ])
                    .then((results) => {
                        let persistentStat = results[0]
                        let persistentContent = results[1]

                        let plainArticle = persistentArticle.get({ plain: true })
                        plainArticle.stat = persistentStat.get({ plain: true })
                        plainArticle.content = persistentContent.get({ plain: true })

                        return plainArticle
                    })
            })
            .then((plainArticle) => {
                console.log(plainArticle)
                return plainArticle
            })
    })
}

exports._createArticle = function *(article) {
    let transientArticle = {
        tags: article.tags,
        title: article.title,
        summary: _extractSummary(article.content),
        createBy: article.createBy
    }
    let persistentArticle = yield models.Article.create(transientArticle)

    let transientContent = {
        articleId: persistentArticle.id,
        content: article.content
    }
    let transientStat = {
        articleId: persistentArticle.id,
        comment: 0,
        pageview: 0
    }
    let associate = yield {
        stat: models.ArticleStat.create(transientStat),
        content: models.ArticleContent.create(transientContent)
    }

    article = persistentArticle.get({ plain: true })
    article.content = associate.content.get('content')
    article.comment = associate.stat.get('comment')
    article.pageview = associate.stat.get('pageview')

    return article
}
/**
 * 新建文章
 * @param {Object} article
 * @return {Object}
 */
exports.createArticle = function *(article) {
    let created = yield models.client.transaction((t) => {
        return co(this._createArticle(article))
    })

    return created
}
exports._updateArticle = function *(article) {
    let existArticle = yield models.Article.findById(article.id)
    if (existArticle != null) {
        existArticle.tags = article.tags
        existArticle.title = article.title
        existArticle.summary = _extractSummary(article.content)
        existArticle.updateBy = article.updateBy
        yield existArticle.save()

        let existContent = yield models.ArticleContent.findOne({ where: { articleId: article.id } })
        existContent.content = article.content
        yield existContent.save()

        article = existArticle.get({ plain: true })
        article.content = existContent.get('content')

        return article
    }

    return null
}
/**
 * 更新文章
 */
exports.updateArticle = function *(article) {
    if (!article || !article.id) {
        return null
    }
    let updated = yield models.client.transaction((t) => {
        return co(this._updateArticle(article))
    })

    return updated
}
/**
 * 查询文章详情
 * @param {Number} articleId
 * @return {Object}
 */
exports.getArticleById = function *(articleId) {
    let persistentArticle = yield models.Article.findById(articleId)

    if (persistentArticle !== null) {
        let associate = yield {
            stat: models.ArticleStat.findOne({ where: { articleId: articleId } }),
            content: models.ArticleContent.findOne({ where: { articleId: articleId } })
        }
        // 查询一次计数就加1 
        yield associate.stat.increment('pageview', { by: 1 })

        let article = persistentArticle.get({ plain: true })
        article.content = associate.content.get('content')
        article.comment = associate.stat.get('comment')
        article.pageview = associate.stat.get('pageview')

        return article
    }

    return null
}
/**
 * 查询文章列表（分页）
 * @param {Object} pageArg
 * @attr {Number}  pageArg.offset
 * @attr {Number}  pageArg.limit
 * @return {Array}
 */
exports.getArticles = function *(pageArg) {
    let articles = yield models.Article.findAndCountAll({
        offset: pageArg.offset,
        limit: pageArg.limit
    })

    let result = {}
    result.count = articles.count
    result.rows = _.map(articles.rows, (value, index) => {
        return value.get({ plain: true })
    })
    return result
}