const Koa = require('koa');
const config = require('config');
const log4js = require('log4js');

const routers = require('./routers');
const middlewares = require('./middlewares');

const app = new Koa();
const log = log4js.getLogger('app');

app.keys = [config.get('app.keys')];
app.use(middlewares.logger());
app.use(middlewares.static());
app.use(middlewares.helmet());
app.use(middlewares.bodyParser());
app.use(middlewares.session(app));
app.use(middlewares.render());
app.use(middlewares.minify());

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

app.use(routers.routes());

module.exports = app;
