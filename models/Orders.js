const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const User = require('./Users');

const Order = sequelize.define('orders', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  userID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: User,
      key: 'userID',
    },
  },
  paycheck: {
    type: DataTypes.FLOAT,
  },
  createdAt: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
  paymentDate: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
});

module.exports = Order;
