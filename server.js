require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')

const userRoutes = require('./api/user/routes');
const categoryRoutes = require('./api/category/routes');
const productRoutes = require('./api/product/routes');
const Product = require('./models/Products');
const Category = require('./models/Categories');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// connect to DB
require('./connection');

Product.belongsTo(Category)

app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

app.listen(process.env.PORT, () => console.log('server running on ', process.env.PORT));