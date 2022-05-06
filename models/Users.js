const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  fullname: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(11),
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING(5),
    allowNull: true,
    defaultValue: 'user'
  },
  verify: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  passCode: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  passCodeExpire: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  birthday: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
  reg_date: {
    type: DataTypes.DATE(),
    allowNull: true,
    defaultValue: Sequelize.NOW
  },
  verifyExpire: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
})


module.exports = User

