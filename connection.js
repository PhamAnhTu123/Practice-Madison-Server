const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('trainning', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
global.sequelize = sequelize;