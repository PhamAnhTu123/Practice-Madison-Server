const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Category = require('./Categories');

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  categoryID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: Category,
      key: 'categoryID',
    },
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  storage: {
    type: DataTypes.INTEGER(),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  deletedAt: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
});

module.exports = Product;
