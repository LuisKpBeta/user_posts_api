"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { paranoid: true }
  );
  user.associate = function(models) {
    user.hasMany(models.post, {
      foreignKey: "creator_id"
    });
  };
  return user;
};
