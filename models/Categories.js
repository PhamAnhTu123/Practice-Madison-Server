const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

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
  productQuantity: {
    type: DataTypes.FLOAT,
  },
  deletedAt: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
});

module.exports = Category;
