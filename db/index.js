const Sequelize = require('sequelize');
const logger = require('../lib/logger');
const env = require('./../config').env;
const sequelize = new Sequelize(env.DB_DATABASE_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
    logging: false,
    host: env.DB_HOST,
    dialect: 'mysql',
    port: env.DB_PORT || 3306,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

// 数据库地址
logger.info('数据库地址：' + (env.DB_HOST + ':' + (env.DB_PORT || 3306) + '/' + env.DB_DATABASE_NAME));


// 定义Model
const Article = sequelize.import(__dirname + "/model/article.js");
const Tag = sequelize.import(__dirname + "/model/tag.js");
const Comment = sequelize.import(__dirname + "/model/comment.js");
const ArticleTag = sequelize.import(__dirname + "/model/articleTag.js");
const User = sequelize.import(__dirname + "/model/user.js");

// 描述表之间的关系

/*
 * Article的实例对象将拥有getTags、setTags、addTag、addTags、createTag、removeTag、hasTag方法
 */
Article.belongsToMany(Tag, {through: ArticleTag});

/*
 * Tag的实例对象将拥有getArticles、setArticles、addArticle、addArticles、createArticle、removeArticle、hasArticle方法
 */
Tag.belongsToMany(Article, {through: ArticleTag});


Article.hasMany(Comment);
Comment.belongsTo(Article);

module.exports = {
    model: {
        Article: Article,
        Tag: Tag,
        Comment: Comment,
        ArticleTag: ArticleTag,
        User: User
    },
    Client: sequelize
};

