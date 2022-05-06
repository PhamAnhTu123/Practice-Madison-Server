const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Product = require('./Products');

const Category = sequelize.define('categories', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
  }
})

Category.hasMany(Product, { as: 'products', foreignKey: 'categoryID' });

module.exports = Category

