const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection');

const User = require('./Users');
const OrderItem = require('./OrderItem');

const Order = sequelize.define('orders', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  userID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: User,
      key: 'userID'
    }
  },
  paycheck: {
    type: DataTypes.FLOAT,
  },
})

Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderID' });

module.exports = Order