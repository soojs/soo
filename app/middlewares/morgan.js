const fs = require('fs');
const path = require('path');
const config = require('config');
const morgan = require('morgan');
const mkdirp = require('mkdirp');
const rfs = require('rotating-file-stream');

module.exports = () => {
  const configLogDir = config.get('app.logdir');
  const logDir = /^\.{1,2}\//.test(configLogDir)
    ? path.join(__dirname, configLogDir)
    : configLogDir;
  if (!fs.existsSync(logDir)) {
    mkdirp.sync(logDir);
  }

  const accessLogSystem = rfs('access.log', {
    interval: '1d',
    path: logDir,
  });

  // 这个是比较正宗的`express morgan middleware`
  const originMorgan = morgan('combined', {
    stream: accessLogSystem,
  });
  return (ctx, next) =>
    new Promise((resolve, reject) => {
      originMorgan(ctx.req, ctx.res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(ctx);
        }
      });
    }).then(next);
};
