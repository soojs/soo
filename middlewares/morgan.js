const fs = require('fs')
const path = require('path')
const config = require('config')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')

function proxyMorgan() {
    const configLogDir = config.get('app.logdir')
    const logDir = /^\.{1,2}\//.test(configLogDir)
        ? path.join(__dirname, configLogDir)
        : configLogDir 
    fs.existsSync(logDir) || fs.mkdirSync(logDir)

    const accessLogSystem = rfs('access.log', {
        interval: '1d',
        path: logDir
    })

    // 这个是比较正宗的`express morgan middleware`
    const originMorgan = morgan('combined', {
        stream: accessLogSystem
    })
    return (ctx, next) => {
        return new Promise((resolve, reject) => {
            originMorgan(ctx.req, ctx.res, (err) => {
                err ? reject(err) : resolve(ctx)
            })
        }).then(next)
    }
}

module.exports = proxyMorgan
