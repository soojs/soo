const co = require('co')

const config = require('config')
const context = config.get('app.admin.context')

/**
 * 管理后台登录页
 */
exports.login = async function (ctx, next) {
    if (ctx.session && ctx.session.authenticated) {
        ctx.redirect(`${context}/admin`)
        return
    }
    await ctx.render('admin/login')
}
/**
 * 退出登录
 */
exports.logout = async function (ctx, next) {
    if (ctx.session) {
        ctx.session = null
    }
    ctx.redirect(`${context}/login`)
}
/**
 * 管理后台首页
 */
exports.admin = async function (ctx, next) {
    if (!ctx.session || !ctx.session.authenticated) {
        ctx.redirect(`${context}/login`)
        return
    }
    await ctx.render('admin/index')
}