/**
 * 文章元数据对象
 */
module.exports = (Sequelize, DataTypes) => {
  const PostMeta = Sequelize.define('PostMeta', {
    id: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    postId: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      defaultValue: 0,
      field: 'post_id',
    },
    like: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    comment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pageview: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'soo_post_meta',
    version: false,
  });

  return PostMeta;
};
