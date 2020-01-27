/* eslint-disable */
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'soo-blog',
      script    : './bin/www.js',
      instances : 0,
      exec_mode : 'cluster',
      env: {
        DEBUG: 'soo-blog:*',
        PORT: 8889,
        NODE_ENV: 'development'
      },
      env_production : {
        PORT: 8888,
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      key  : '',
      user : 'fxiaoke',
      host : 'firstshare.co',
      ref  : 'origin/master',
      repo : 'git@git.coding.net:jerrydot0/soo-blog.git',
      path : '~/pm2/soo-blog',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      key  : '',
      user : 'fxiaoke',
      host : 'firstshare.co',
      ref  : 'origin/master',
      repo : 'git@git.coding.net:jerrydot0/soo-blog.git',
      path : '~/pm2/soo-blog-dev',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
