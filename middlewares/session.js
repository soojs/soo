const session = require('koa-session')

const SESSION_CONFIG = {
    key: 'sid',
    maxAge: 'session',
    overwrite: true,
    httpOnly: true,
    signed: true
}

module.exports = (app) => {
    return session(SESSION_CONFIG, app)
}