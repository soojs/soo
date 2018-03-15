const Koa = require('koa');
const config = require('config');

const routers = require('./routers');
const middlewares = require('./middlewares');

const app = new Koa();

app.keys = [config.get('app.keys')];
if (config.get('debug') === true) {
  app.use(middlewares.logger());
}
app.use(middlewares.morgan());
app.use(middlewares.helmet());
app.use(middlewares.bodyParser());
app.use(middlewares.session(app));
app.use(middlewares.render());
app.use(middlewares.minify());

app.use(routers.routes());
// app.use(router.routes())
// app.use(router.allowedMethods())
// error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // TODO 这里需要记录异常
    // debug(ctx._matchedRoute)
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

module.exports = app;
