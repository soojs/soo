const router = require('koa-router')();

router.all('/', (ctx) => {
  ctx.body = 'hello test';
});

// 这个需要放在`/:id`的前面
router.all('/auth', (ctx) => {
  if (!ctx.session || !ctx.session.username) {
    ctx.throw(401);
  }
}, (ctx) => {
  ctx.body = `hello ${ctx.session.username}`;
});

router.all('/upload', (ctx) => {
  ctx.body = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
      <form method="POST" action="/api/v1/file/upload?_csrf=" enctype="multipart/form-data">
        title: <input name="title" />
        file: <input name="file" type="file" />
        <button type="submit">Upload</button>
      </form>
      </body>
    </html>
    `;
});

router.all('/:id', (ctx) => {
  ctx.body = `hello ${ctx.params.id}`;
});

module.exports = router;
