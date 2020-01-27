/**
 * 标签对象
 */
module.exports = (Sequelize, DataTypes) => {
  const Tag = Sequelize.define('Tag', {
    id: {
      type: DataTypes.BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    timestamps: false,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'soo_tag',
    version: false,
  });

  Tag.associate = (models) => {
    Tag.hasMany(models.TagPost, {
      as: 'posts',
      foreignKey: 'tagId',
    });
  };

  return Tag;
};
