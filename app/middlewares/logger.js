const log4js = require('log4js');

module.exports = (
  logger4js = log4js.getLogger('http'),
  options = { level: 'auto' },
) => {
  const originLogger = log4js.connectLogger(logger4js, options);
  return (ctx, next) =>
    new Promise((resolve, reject) => {
      originLogger(ctx.req, ctx.res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(ctx);
        }
      });
    }).then(next);
};
