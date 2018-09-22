'use strict';

module.exports = (sequelize, DataTypes) => {

  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    photo: DataTypes.STRING,
    email:DataTypes.STRING,
    phone: DataTypes.STRING,
    password:DataTypes.STRING,
    role: DataTypes.INTEGER,
    address: DataTypes.STRING,
  }, 
  
  {
    tableName:'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  User.associate = function (models) {

    models.User.hasMany(models.Product, {
      onDelete: "CASCADE",
      foreignKey: "created_by",
    });

  };


 // roles 
  User.CUSTOMER = 0;
  User.STAFF = 1;
  User.MANAGER = 2;
  User.ADMIN = 3;

  return User;

};
