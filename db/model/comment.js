const Comment = function(Sequelize, DataTypes) {
    return Sequelize.define("comment",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nick_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(1000),
                allowNull: false
        },
        // 评论是否通过管理员审核，默认通过。为删除评论提供方便 
        is_pass: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1
        },
        email: {
            type: DataTypes.STRING(200),
            allowNull: true
        }
    }, {
        freezeTableName: true
    });
};

module.exports = Comment;
