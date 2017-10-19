const session = require('koa-session')

const SESSION_CONFIG = {
    key: 'sid',
    maxAge: 'session',
    overwrite: true,
    httpOnly: true,
    signed: true
}

module.exports = function(app) {
    return session(SESSION_CONFIG, app)
}