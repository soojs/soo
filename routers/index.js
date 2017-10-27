const root = require('koa-router')()

const tests = require('./test')
const posts = require('./post')
const apis = require('../apis')

root.use('/', posts.routes(), posts.allowedMethods())
root.use('/test', tests.routes(), tests.allowedMethods())
root.use('/api', apis.routes(), apis.allowedMethods())

const stack = root.stack
stack.forEach((item) => {
    console.log(`Matched path: ${item.path}`)
})
module.exports = root
