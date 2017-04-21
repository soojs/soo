module.exports = function (sequelize, DataTypes) {
    var Article = sequelize.define('Article', {
        // PRIMARY KEY
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        // 文章标签列表
        tags: {
            type: DataTypes.STRING
        },
        // 文章标题
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // 文章摘要
        summary: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        // 文章状态：0草稿；1-发布
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        // 创建人
        create_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // 更新人
        update_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        update_time: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,

        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,

        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,

        // define the table's name
        tableName: 'fx_article'
    });

    return Article;
}