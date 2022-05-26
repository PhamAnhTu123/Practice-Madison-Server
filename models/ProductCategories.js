const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Category = require('./Categories');
const Product = require('./Products');

const ProductCategories = sequelize.define('product_categories', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  productID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: Product,
      key: 'productID',
    },
  },
  categoryID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: Category,
      key: 'categoryID',
    },
  },
  created_at: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
});

module.exports = ProductCategories;
