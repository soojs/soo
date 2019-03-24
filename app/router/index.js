const debug = require('debug')('bee-blog:route');
const config = require('config');
const root = require('koa-router')();

const api = require('../api');
const posts = require('./post');
const tests = require('./test');

const admin = require('./admin');

root.use('/', posts.routes(), posts.allowedMethods());
root.use('/test', tests.routes(), tests.allowedMethods());
root.use('/api', api.routes(), api.allowedMethods());
root.use(`${config.get('app.admin.context')}`, admin.routes(), admin.allowedMethods());

const { stack } = root;
stack.forEach((item) => {
  debug(`Matched path: ${item.path}`);
});

module.exports = root;
