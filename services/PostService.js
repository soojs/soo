const co = require('co')
const _  = require('lodash')

const Const = require('../common/const')
const helper = require('../lib/helper')
const models = require('../models')

exports._createPost = function *(post) {
    let transientPost = {
        tags: post.tags,
        desc: post.desc,
        title: post.title,
        summary: helper.extractSummary(post.content),
        permalink: post.permalink,
        createAt: post.createAt,
        createBy: post.createBy
    }
    let persistentPost = yield models.Post.create(transientPost)

    let transientStat = {
        postId: persistentPost.id,
        comment: 0,
        pageview: 0
    }
    let transientMDContent = {
        postId: persistentPost.id,
        content: post.content,
        type: Const.POST_FMT.MARKDOWN
    }
    let transientHTMLContent = {
        postId: persistentPost.id,
        content: helper.markdown2html(post.content),
        type: Const.POST_FMT.HTML
    }
    let associate = yield {
        stat: models.PostStat.create(transientStat),
        mdContent: models.PostContent.create(transientMDContent),
        htmlContent: models.PostContent.create(transientHTMLContent)
    }

    post = persistentPost.get({ plain: true })
    if (associate.htmlContent) {
        post.content = associate.htmlContent.get('content')
    }
    if (associate.stat) {
        post.comment = associate.stat.get('comment')
        post.pageview = associate.stat.get('pageview')
    }

    return post
}
/**
 * 新建文章
 * @param {Object} post
 * @return {Object}
 */
exports.createPost = function *(post) {
    let created = yield models.client.transaction((t) => {
        return co(this._createPost(post))
    })

    return created
}
exports._updatePost = function *(post) {
    let existPost = yield models.Post.findById(post.id)
    if (existPost != null) {
        existPost.tags = post.tags
        existPost.title = post.title
        existPost.summary = helper.extractSummary(post.content)
        existPost.updateBy = post.updateBy
        yield existPost.save()

        let existMDContent = yield models.PostContent.findOne({
            where: { postId: post.id, type: Const.POST_FMT.MARKDOWN }
        })
        if (existMDContent) {
            existMDContent.content = post.content
            yield existMDContent.save()
        }

        let existHTMLContent = yield models.PostContent.findOne({
            where: { postId: post.id, type: Const.POST_FMT.HTML }
        })
        if (existHTMLContent) {
            existHTMLContent.content = helper.markdown2html(post.content)
            yield existHTMLContent.save()
        }

        post = existPost.get({ plain: true })
        if (existHTMLContent) {
            post.content = existHTMLContent.get('content')
        }

        return post
    }

    return null
}
/**
 * 更新文章
 */
exports.updatePost = function *(post) {
    if (!post || !post.id) {
        return null
    }
    let updated = yield models.client.transaction((t) => {
        return co(this._updatePost(post))
    })

    return updated
}
/**
 * 查询文章详情
 * @param {Number} postId
 * @param {Number} type 
 * @return {Object}
 */
exports.getPostById = function *(postId, type = 0) {
    let persistentPost = yield models.Post.findById(postId)

    if (persistentPost !== null) {
        let associate = yield {
            stat: models.PostStat.findOne({ where: { postId: postId } }),
            content: models.PostContent.findOne({
                where: { postId: postId, type: type } 
            })
        }
        // 查询一次计数就加1 
        yield associate.stat.increment('pageview', { by: 1 })

        let post = persistentPost.get({ plain: true })
        if (associate.content) {
            post.content = associate.content.get('content')
        }
        if (associate.stat) {
            post.comment = associate.stat.get('comment')
            post.pageview = associate.stat.get('pageview')
        }

        return post
    }

    return null
}
/**
 * 查询文章详情
 * @param {String} permalink
 * @param {Number} type 
 * @return {Object}
 */
exports.getPostByPermalink = function *(permalink, type = 0) {
    let persistentPost = yield models.Post.findOne({
        where: { permalink: permalink }
    })

    if (persistentPost !== null) {
        let associate = yield {
            stat: models.PostStat.findOne({
                where: { postId: persistentPost.id }
            }),
            content: models.PostContent.findOne({
                where: { postId: persistentPost.id, type: type } 
            })
        }
        // 查询一次计数就加1 
        yield associate.stat.increment('pageview', { by: 1 })

        let post = persistentPost.get({ plain: true })
        if (associate.content) {
            post.content = associate.content.get('content')
        }
        if (associate.stat) {
            post.comment = associate.stat.get('comment')
            post.pageview = associate.stat.get('pageview')
        }

        return post
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
exports.getPosts = function *(pageArg) {
    let posts = yield models.Post.findAndCountAll({
        offset: pageArg.offset,
        limit: pageArg.limit
    })

    let result = {}
    result.count = posts.count
    result.rows = _.map(posts.rows, (value, index) => {
        return value.get({ plain: true })
    })
    return result
}