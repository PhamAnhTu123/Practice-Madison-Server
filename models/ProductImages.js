const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Product = require('./Products');

const ProductImages = sequelize.define('product_images', {
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
  url: {
    type: DataTypes.STRING(250),
  },
  created_at: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
});

module.exports = ProductImages;
