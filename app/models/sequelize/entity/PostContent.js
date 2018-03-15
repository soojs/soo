/**
 * 文章内容对象
 */
module.exports = (Sequelize, DataTypes) => {
  const PostContent = Sequelize.define('PostContent', {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'bee_post_content',
    version: false,
  });

  return PostContent;
};
