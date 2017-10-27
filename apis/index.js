const router = require('koa-router')()
const v1 = require('./v1')

function auth(ctx, next) {
    if (!ctx.session || !ctx.session.username) {
        ctx.throw(401)
    } else {
        next()
    }
}

router.get('/v1/post/', v1.article.list)
router.get('/v1/post/:id', v1.article.getById)
router.put('/v1/post', auth, v1.article.update)
router.post('/v1/post', auth, v1.article.create)

router.get('/v1/user/:username', v1.user.getByUsername)
router.post('/v1/user', auth, v1.user.create)

module.exports = router
