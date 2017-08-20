const Router = require('koa-router')
const router = new Router()

require('./article').register(router)

module.exports = router.middleware()