const Tag = function(Sequelize, DataTypes) {
    return Sequelize.define("tag",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
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

module.exports = Tag;
