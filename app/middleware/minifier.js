const minifier = require('html-minifier');

module.exports = () =>
  (ctx, next) =>
    next().then(() => {
      if (!ctx.response.is('html')) {
        return;
      }
      let { body } = ctx;
      if (!body || typeof body.pipe === 'function') {
        return;
      }
      if (Buffer.isBuffer(body)) {
        body = body.toString('utf8');
      } else if (typeof body === 'object') {
        return;
      }
      ctx.body = minifier.minify(body, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      });
    });
