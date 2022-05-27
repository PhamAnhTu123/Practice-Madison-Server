const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Category = require('./Categories');

const CategoryImages = sequelize.define('category_images', {
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
  url: {
    type: DataTypes.STRING(250),
  },
  status: {
    type: DataTypes.STRING(100),
  },
  created_at: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
});

module.exports = CategoryImages;
