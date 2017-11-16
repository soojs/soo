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
 * @param {Object} post
 * @return {Object}
 */
exports.createPost2Old = function (post) {
    if (post === null || !post.content) {
        throw new Error('Post or post content cannot be empty')
    }

    return models.client.transaction((t) => {
        let now = Date.now()
        let transientPost = {
            tags: post.tags,
            title: post.title,
            summary: _extractSummary(post.content),
            createBy: post.createBy,
            status: 0,
            createTime: now,
            updateTime: now
        }

        return models.Post
            .create(transientPost)
            .then((persistentPost) => {
                let transientContent = {
                    postId: persistentPost.id,
                    content: post.content
                }
                let transientStat = {
                    postId: persistentPost.id,
                    comment: 0,
                    pageview: 0
                }

                return Promise
                    .all([
                        models.PostStat.create(transientStat),
                        models.PostContent.create(transientContent)
                    ])
                    .then((results) => {
                        let persistentStat = results[0]
                        let persistentContent = results[1]

                        let plainPost = persistentPost.get({ plain: true })
                        plainPost.stat = persistentStat.get({ plain: true })
                        plainPost.content = persistentContent.get({ plain: true })

                        return plainPost
                    })
            })
            .then((plainPost) => {
                console.log(plainPost)
                return plainPost
            })
    })
}

exports._createPost = function *(post) {
    let transientPost = {
        tags: post.tags,
        title: post.title,
        summary: _extractSummary(post.content),
        createBy: post.createBy
    }
    let persistentPost = yield models.Post.create(transientPost)

    let transientContent = {
        postId: persistentPost.id,
        content: post.content
    }
    let transientStat = {
        postId: persistentPost.id,
        comment: 0,
        pageview: 0
    }
    let associate = yield {
        stat: models.PostStat.create(transientStat),
        content: models.PostContent.create(transientContent)
    }

    post = persistentPost.get({ plain: true })
    post.content = associate.content.get('content')
    post.comment = associate.stat.get('comment')
    post.pageview = associate.stat.get('pageview')

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
        existPost.summary = _extractSummary(post.content)
        existPost.updateBy = post.updateBy
        yield existPost.save()

        let existContent = yield models.PostContent.findOne({ where: { postId: post.id } })
        existContent.content = post.content
        yield existContent.save()

        post = existPost.get({ plain: true })
        post.content = existContent.get('content')

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
 * @return {Object}
 */
exports.getPostById = function *(postId) {
    let persistentPost = yield models.Post.findById(postId)

    if (persistentPost !== null) {
        let associate = yield {
            stat: models.PostStat.findOne({ where: { postId: postId } }),
            content: models.PostContent.findOne({ where: { postId: postId } })
        }
        // 查询一次计数就加1 
        yield associate.stat.increment('pageview', { by: 1 })

        let post = persistentPost.get({ plain: true })
        post.content = associate.content.get('content')
        post.comment = associate.stat.get('comment')
        post.pageview = associate.stat.get('pageview')

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