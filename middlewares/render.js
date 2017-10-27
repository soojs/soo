const path = require('path')
const views = require('koa-views')

const util = require('../lib/util')
const appInfo = require('../app.json')

module.exports = () => {
    return views(path.join(__dirname, '/../views'), {
        map: {
            ejs: 'ejs'
        },
        extension: 'ejs',
        options: {
            // 全局应用信息
            app: appInfo,
            // 全局工具方法
            helpers: {
                // 时间格式化
                mformat: (time, fmt) => {
                    return util.timeFormat(time, fmt || 'yyyy-MM-dd HH:mm:ss')
                }
            }
        }
    })
}
