const path = require('path');
const views = require('koa-views');

const appInfo = require('../app.json');
const { timeFormat } = require('../lib/helper');

module.exports = () =>
  views(path.join(__dirname, '/../views'), {
    map: {
      ejs: 'ejs',
    },
    extension: 'ejs',
    options: {
      // 全局应用信息
      app: appInfo,
      // 全局工具方法
      helpers: {
        // 时间格式化
        mformat: (time, fmt) => timeFormat(time, fmt || 'yyyy-MM-dd HH:mm:ss'),
      },
    },
  });
