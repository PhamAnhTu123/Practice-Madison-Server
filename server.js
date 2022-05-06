require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')

const userRoutes = require('./api/user/routes');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// connect to DB
require('./connection');

app.use(userRoutes);

app.listen(process.env.PORT, () => console.log('server running on ', process.env.PORT));