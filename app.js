const Koa = require('koa')
const Router = require('koa-router')
const config = require('config')

const db = require('./models').client
const middlewares = require('./middlewares')

const port = process.env.PORT || '8989'
const router = new Router()
const app = new Koa()

app.keys = [config.get('keys')]
if (config.get('debug') === true) {
    app.use(middlewares.logger())
}
app.use(middlewares.morgan())
app.use(middlewares.bodyParser())
app.use(middlewares.session(app))
app.use(middlewares.render())

// REST接口列表
require('./apis/v1/article').register(router)
// SSR
require('./controllers/article').register(router)

app.use(router.routes())
app.use(router.allowedMethods())
// error handler
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || 500
        ctx.body = err.message
        ctx.app.emit('error', err, ctx);
    }
})

// db
//     .sync()
//     .then(() => {
//         app.listen(port)
//         console.log('server is listening on port %s', port)
//     })
//     .catch((err) => {
//         throw err
//     })

module.exports = app
    