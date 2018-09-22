'use strict';

module.exports = (sequelize, DataTypes) => {

  var Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    brand_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    created_by: DataTypes.INTEGER,         
  }, 
  
  {
    tableName:'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });


  Product.associate = function (models) {

    models.Product.belongsTo(models.Category, {
      onDelete: "CASCADE",
      foreignKey: "category_id",
    });

    models.Product.belongsTo(models.Brand, {
      onDelete: "CASCADE",
      foreignKey: "brand_id",
    });

    models.Product.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: "created_by",
    });

  };

  return Product;

};
