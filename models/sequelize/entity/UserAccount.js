/**
 * 用户帐号对象
 */
module.exports = function(Sequelize, DataTypes) {

    return Sequelize.define('UserAccount', {
        id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        roles: {
            type: DataTypes.STRING(64),
            allowNull: false
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
        tableName: 'bee_user_account',
        version: false
    })
}
