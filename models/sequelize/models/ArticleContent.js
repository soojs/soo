module.exports = function (sequelize, DataTypes) {
    var ArticleContent = sequelize.define('ArticleContent', {
        // PRIMARY KEY
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        // 文章阅读总数
        content: {
            type: DataTypes.TEXT,
            defaultValue: 0
        }
    });

    return ArticleContent;
}