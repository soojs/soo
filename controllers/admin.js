const config = require('config');

const context = config.get('app.admin.context');

exports.login = async (ctx) => {
  if (ctx.session && ctx.session.authenticated) {
    ctx.redirect(`${context}/admin`);
    return;
  }
  await ctx.render('admin/login');
};

exports.logout = async (ctx) => {
  if (ctx.session) {
    ctx.session = null;
  }
  ctx.redirect(`${context}/login`);
};

exports.admin = async (ctx) => {
  if (!ctx.session || !ctx.session.authenticated) {
    ctx.redirect(`${context}/login`);
    return;
  }
  await ctx.render('admin/index');
};
