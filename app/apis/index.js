const router = require('koa-router')();
const v1 = require('./v1');

function auth(ctx, next) {
  if (!ctx.session || !ctx.session.user ||
      !ctx.session.user.username) {
    ctx.throw(401);
  }
  return next();
}

router.get('/v1/post/', v1.post.list);
router.get('/v1/post/:id', v1.post.getById);
router.post('/v1/post', auth, v1.post.create);
router.put('/v1/post/:id', auth, v1.post.update);
router.patch('/v1/post/:id', auth, v1.post.publish);
router.delete('/v1/post/:id', auth, v1.post.remove);

router.get('/v1/user/', v1.user.list);
router.get('/v1/user/:username', v1.user.getByUsername);
router.post('/v1/user', auth, v1.user.create);
router.post('/v1/user/login', v1.user.login);

router.post('/v1/file/upload', auth, v1.file.upload);

router.get('/v1/tag/', v1.tag.list);
router.post('/v1/tag', v1.tag.create);

module.exports = router;
