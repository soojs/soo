const router = require('koa-router');
const appRouter = new router({
    prefix: '/cgi'
});
const fs =require('fs');



// 加载所有路由
fs.readdirSync(__dirname + '/routes')
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        require(__dirname + '/routes/' + file)(appRouter);
    });

module.exports = appRouter;

