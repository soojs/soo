const session = require('koa-session');

module.exports = (app) => {
  const func = session({
    key: 'sid',
    maxAge: 'session',
    overwrite: true,
    httpOnly: true,
    signed: true,
  }, app);
  return func;
};
