const router = require('koa-router')()
const controller = require('../controllers').post

router.all('', controller.list)
router.all('post/:id', controller.getById)

module.exports = router
