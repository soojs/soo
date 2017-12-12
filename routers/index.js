const debug = require('debug')('bee-blog:route');
const config = require('config');
const root = require('koa-router')();

const apis = require('../apis');
const posts = require('./post');
const tests = require('./test');

const admin = require('./admin');

root.use('/', posts.routes(), posts.allowedMethods());
root.use('/test', tests.routes(), tests.allowedMethods());
root.use('/api', apis.routes(), apis.allowedMethods());
root.use(`${config.get('app.admin.context')}`, admin.routes(), admin.allowedMethods());

const { stack } = root;
stack.forEach((item) => {
  debug(`Matched path: ${item.path}`);
});

module.exports = root;
