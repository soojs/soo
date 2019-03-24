const router = require('koa-router')();
const controller = require('../controller').post;

router.all('', controller.list);
router.all('rss.xml', controller.rss);
router.all('about', controller.about);
router.all('archives', controller.archives);
router.all('post/:id(\\d+)', controller.getById);
router.all('post/:permalink([a-zA-Z0-9\\-]+)', controller.getByPermalink);

module.exports = router;
