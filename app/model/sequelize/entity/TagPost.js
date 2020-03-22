/**
 * 标签POST关联对象
 */
module.exports = (Sequelize, DataTypes) => {
  const TagPost = Sequelize.define('TagPost', {
    id: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    tagId: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      defaultValue: 0,
      field: 'tag_id',
    },
    postId: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      defaultValue: 0,
      field: 'post_id',
    },
  }, {
    timestamps: false,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'soo_tag_post',
    version: false,
  });

  TagPost.associate = (models) => {
    TagPost.belongsTo(models.Tag, {
      as: 'tag',
      foreignKey: 'tagId',
    });
  };

  return TagPost;
};
