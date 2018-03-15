/**
 * 用户帐号对象
 */
module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    lastLoginIp: {
      type: DataTypes.STRING(64),
      field: 'last_login_ip',
    },
    lastLoginTime: {
      type: DataTypes.DATE,
      field: 'last_login_time',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'create_by',
    },
    updateBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'update_by',
    },
    createAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'create_at',
    },
    updateAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'update_at',
    },
  }, {
    timestamps: false,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'bee_user_account',
    version: false,
  });

  User.associate = (models) => {
    User.hasMany(models.Post, {
      as: 'posts',
      foreignKey: 'createBy',
    });
  };

  return User;
};
