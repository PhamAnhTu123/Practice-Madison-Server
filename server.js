require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')
const { Sequelize } = require('sequelize');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

require('./connection');

// const sequelize = new Sequelize('trainning', 'root', '123456', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

// const testConnect = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

app.get('/api/v1/wellcome', (req, res) => {
  res.status(200).json({body: 'Hi there'})
})

// testConnect();

app.listen(process.env.PORT, () => console.log('server running on ', process.env.PORT));