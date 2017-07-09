module.exports = function (sequelize, DataTypes) {
    var ArticleStat = sequelize.define('ArticleStat', {
        // PRIMARY KEY
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        // 文章评论总数
        comment: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        // 文章阅读总数
        pageview: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    return ArticleStat;
}