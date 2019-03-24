const router = require('koa-router')();
const controller = require('../controller').admin;

router.get('/login', controller.login);
router.get('/admin', controller.admin);

module.exports = router;
