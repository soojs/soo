/**
 * 文章对象
 */
module.exports = (Sequelize, DataTypes) => {

    return Sequelize.define('Article', {
        id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        tags: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: ''
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        summary: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        createBy: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'create_by'
        },
        updateBy: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'update_by'
        },
        createAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'create_at'
        },
        updateAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'update_at'
        }
    }, {
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'fx_article',
        // version: true
    })
}
