const Koa = require('koa')
const middlewares = require('./lib/middlewares')
const co = require('co')
const db = require('./models').client

const app = new Koa()

app.use(middlewares.favicon())
app.use(middlewares.logger())
app.use(middlewares.responseTime())
app.use(middlewares.compress())

// koa-session
const SessionConfig = {
    key: 'sid',
    maxAge: 'session',
    httpOnly: true,
    signed: true
}
app.keys = ['some secret hurr']
app.use(middlewares.session(SessionConfig, app))

// const apis = require('./apis')

// app.use(middlewares.mount('/v1', apis.v1))

const router = require('koa-router')()

// REST接口列表
require('./apis/v1/article').register(router)

// SSR
require('./controllers/article').register(router)


app.use(router.routes())

co(function *() {
    let connection = yield db.sync()
    if (connection) {
        app.listen(3000)
        console.log('server is listening on port 3000')
    }
})
