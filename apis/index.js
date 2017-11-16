const router = require('koa-router')()
const v1 = require('./v1')

function auth(ctx, next) {
    if (!ctx.session || !ctx.session.username) {
        ctx.throw(401)
    } else {
        next()
    }
}

router.get('/v1/post/', v1.post.list)
router.get('/v1/post/:id', v1.post.getById)
router.put('/v1/post', auth, v1.post.update)
router.post('/v1/post', auth, v1.post.create)

router.get('/v1/user/:username', v1.user.getByUsername)
router.post('/v1/user', v1.user.create)
router.post('/v1/user/login', v1.user.login)

module.exports = router
