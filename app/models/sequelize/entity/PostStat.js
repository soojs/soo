/**
 * 文章统计对象
 */
module.exports = (Sequelize, DataTypes) => {
  const PostStat = Sequelize.define('PostStat', {
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
    tableName: 'bee_post_stat',
    version: false,
  });

  return PostStat;
};
