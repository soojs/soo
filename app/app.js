const Koa = require('koa');
const config = require('config');
const log4js = require('log4js');

const router = require('./router');
const middleware = require('./middleware');

const app = new Koa();
const log = log4js.getLogger('app');

app.keys = [config.get('app.keys')];
app.use(middleware.logger());
app.use(middleware.static());
app.use(middleware.helmet());
app.use(middleware.bodyParser());
app.use(middleware.session(app));
app.use(middleware.render());
app.use(middleware.minify());

// error handler, must before routers
// so that can catch all business exception
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    log.error('request error ', err);
    ctx.status = err.status || 500;
    // ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

app.use(router.routes());

module.exports = app;
