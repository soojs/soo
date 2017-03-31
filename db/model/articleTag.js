const TagArticle = function(Sequelize, DataTypes) {
    return Sequelize.define("article_tag", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    }, {
        freezeTableName: true
    });
};

module.exports = TagArticle;