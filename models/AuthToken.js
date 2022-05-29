const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const AuthToken = sequelize.define('auth_tokens', {
  id: {
    type: DataTypes.INTEGER(6).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
});

module.exports = AuthToken;
