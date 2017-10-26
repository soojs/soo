const path = require('path')
const views = require('koa-views')

module.exports = () => {
    return views(path.join(__dirname, '/../views'), {
        map: {
            ejs: 'ejs'
        }
    })
}
