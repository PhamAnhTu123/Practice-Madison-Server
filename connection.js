const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('trainning', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
  logging: false,
});

module.exports = sequelize;
global.sequelize = sequelize;
