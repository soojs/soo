/**
 * 标签对象
 */
module.exports = function(Sequelize, DataTypes) {

    return Sequelize.define('Tag', {
        id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: ''
        }
    }, {
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'fx_tag',
        version: true
    })
}
