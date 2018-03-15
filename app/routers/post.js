const router = require('koa-router')();
const controller = require('../controllers').post;

router.all('', controller.list);
router.all('post/:id(\\d+)', controller.getById);
router.all('post/:permalink([a-zA-Z0-9\\-]+)', controller.getByPermalink);

module.exports = router;
