module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        // PRIMARY KEY
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
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
            type: DataTypes.STRING,
            allowNull: false
        },
        create_by: {
            type: DataTypes.STRING,
            allowNull: false
        },
        update_by: {
            type: DataTypes.STRING,
            allowNull: false
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        update_time: {
            type: DataTypes.DATE,
            allowNull: false
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
        tableName: 'fx_user'
    });

    return User;
}