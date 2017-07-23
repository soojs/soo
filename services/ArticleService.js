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
exports.createArticle = function (article) {
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

    // return models.db.client.transaction((t) => {
          
    //     let transientArticle = {
    //         tags: article.tags,
    //         title: article.title,
    //         summary: _extractSummary(article.content),
    //         createBy: article.createBy
    //     }
    //     let promise = models.Article.create(transientArticle)

    //     return promise.next().value
    //         .then((articleBasic) => {
    //             let transientContent = {
    //                 articleId: articleBasic.id,
    //                 content: article.content
    //             }
    //             let transientStat = {
    //                 articleId: articleBasic.id,
    //                 comment: 0,
    //                 pageview: 0
    //             }

    //             return Promise.all([
    //                 models.ArticleStat.create(transientStat),
    //                 models.ArticleContent.create(transientContent)
    //             ])
    //         })

        // console.log(`=======`, persistentArticle.next().value)

        
        // let transientStat = {
        //     articleId: persistentArticle.id,
        //     comment: 0,
        //     pageview: 0
        // }

        // persistentArticle.stat = models.ArticleStat.create(transientStat)
        // persistentArticle.content = models.ArticleContent.create(transientContent)
    // })

    // let transientArticle = {
    //     tags: article.tags,
    //     title: article.title,
    //     summary: _extractSummary(article.content),
    //     createBy: article.createBy
    // }
    // let persistentArticle = yield models.Article.create(transientArticle)

    // let transientContent = {
    //     articleId: persistentArticle.id,
    //     content: article.content
    // }
    // let transientStat = {
    //     articleId: persistentArticle.id,
    //     comment: 0,
    //     pageview: 0
    // }
    // let associate = yield {
    //     stat: models.ArticleStat.create(transientStat),
    //     content: models.ArticleContent.create(transientContent)
    // }

    // persistentArticle.stat = associate.stat
    // persistentArticle.content = associate.content

    // return result
}

exports.createArticle2 = function *(article) {
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

    persistentArticle.stat = associate.stat
    persistentArticle.content = associate.content

    return persistentArticle
}

let co = require('co')
exports.createArticle3 = function (article) {
    return models.client.transaction((t) => {
        return co(exports.createArticle2(article))
    })
}