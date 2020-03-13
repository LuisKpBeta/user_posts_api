"use strict";
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define(
    "post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { paranoid: true }
  );
  post.associate = function(models) {
    post.belongsTo(models.user, {
      foreignKey: "creator_id",
      onDelete: "cascade"
    });
  };
  return post;
};
