/**
 * 文章统计对象
 */
module.exports = function(Sequelize, DataTypes) {

    return Sequelize.define('ArticleStat', {
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
        comment: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        pageview: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'fx_article_stat',
        version: true
    })
}
