const Article = function(Sequelize, DataTypes) {
    return Sequelize.define("article",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        brief: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        read_num: {
            type: DataTypes.INTEGER
        },
        content: {
            type: DataTypes.TEXT('LONGTEXT'),
            allowNull: false
        },
        publish_time: {
            type: DataTypes.DATE,
            //defaultValue: Sequelize.NOW,
            // defaultValue: Sequelize.fn('NOW'),
            allowNull: true
        },
        type: {
            // 枚举必须使用字符串
            /**
             * 100: 普通类型
             * 200：富文本类型
             * 300：markdown类型
             */
            type: DataTypes.ENUM('100', '200', '300'),
            allowNull: false
        },
        status: {
            /**
             * 文章状态：
             * 0：草稿
             * 1：已发布
             * 2：已删除
             */
            type: DataTypes.ENUM('0', '1', '2'),
            allowNull: false,
            defaultValue: '1'
        }
    }, {
        // 索引
        indexes: [
            // A BTREE index with a ordered field
            {
                name: 'title_index',
                method: 'BTREE',
                fields: ['publish_time', {attribute: 'title', collate: 'en_US', order: 'DESC', length: 15}]
            }
        ],
        freezeTableName: true
    });
};

module.exports = Article;