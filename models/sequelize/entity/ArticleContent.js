/**
 * 文章内容对象
 */
module.exports = function(Sequelize, DataTypes) {

    return Sequelize.define('ArticleContent', {
        id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        articleId: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            defaultValue: 0,
            field: 'article_id'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        }
    }, {
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'fx_article_content',
        version: true
    })
}
