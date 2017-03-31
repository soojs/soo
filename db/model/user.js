/**
 * 用户，用于权限控制
 */

const User = function(Sequelize, DataTypes) {
    return Sequelize.define("user",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        qq: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        weixin: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        is_delete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        freezeTableName: true
    });
};

module.exports = User;

