const Const = require('../../../common/const');

/**
 * 文章对象
 */
module.exports = (Sequelize, DataTypes) => {
  const Post = Sequelize.define('Post', {
    id: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    tags: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
    },
    desc: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    permalink: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: 'create_at',
    },
    updateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: 'update_at',
    },
  }, {
    timestamps: false,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'bee_post',
    version: false,
    getterMethods: {
      stat() {
        return this.getDataValue('stat');
      },
      content() {
        let content = this.getDataValue('content');
        if (!content) {
          const contents = this.getDataValue('contents');
          if (contents && contents.length > 0) {
            contents.every((item) => {
              if (item.type === Const.POST_FMT.HTML) {
                ({ content } = item);
                return false;
              }
              return true;
            });
          }
        }
        return content;
      },
    },
    setterMethods: {
      stat(value) {
        this.setDataValue('stat', value);
      },
      content(value) {
        this.setDataValue('content', value);
      },
    },
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'createBy',
    });
    Post.hasMany(models.PostContent, {
      as: 'contents',
      foreignKey: 'postId',
    });
    Post.hasOne(models.PostStat, {
      as: 'stat',
      foreignKey: 'postId',
    });
  };

  return Post;
};
