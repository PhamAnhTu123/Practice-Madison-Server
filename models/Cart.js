const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Product = require('./Products');
const User = require('./Users');

const Cart = sequelize.define('carts', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: User,
      key: 'userID',
    },
  },
  productID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: Product,
      key: 'userID',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  created_at: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
});

module.exports = Cart;
