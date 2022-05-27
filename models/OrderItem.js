const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Order = require('./Orders');
const Product = require('./Products');

const OrderItem = sequelize.define('order_items', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  orderID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: Order,
      key: 'orderID',
    },
  },
  productID: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    references: {
      model: Product,
      key: 'productID',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.FLOAT,
  },
});

module.exports = OrderItem;
