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
app.use(middlewares.responseTime())
app.use(middlewares.compress())
app.use(middlewares.session(app))

// REST接口列表
require('./apis/v1/article').register(router)
// SSR
// require('./controllers/article').register(router)

app.use(router.routes())
app.use(router.allowedMethods())

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
    