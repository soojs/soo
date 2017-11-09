const router = require('koa-router')()
const controller = require('../controllers').admin

router.get('/login', controller.login)
router.get('/admin', controller.admin)

module.exports = router
