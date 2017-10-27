const router = require('koa-router')()

router.all('/', (ctx, next) => {
    ctx.body = 'hello test'
})

// 这个需要放在`/:id`的前面
router.all('/auth', (ctx, next) => {
    if (!ctx.session || !ctx.session.username) {
        ctx.throw(401)
    }
}, (ctx, next) => {
    ctx.body = `hello ${ctx.session.username}`
})

router.all('/:id', (ctx, next) => {
    ctx.body = `hello ${ctx.params.id}`
})

module.exports = router
