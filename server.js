/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const userRoutes = require('./api/user/routes');
const categoryRoutes = require('./api/category/routes');
const productRoutes = require('./api/product/routes');
const orderRoutes = require('./api/order/routes');
const cartRoutes = require('./api/cart/routes');

const Product = require('./models/Products');
const Category = require('./models/Categories');
const OrderItem = require('./models/OrderItem');
const Order = require('./models/Orders');
const sequelize = require('./connection');
const User = require('./models/Users');
const Cart = require('./models/Cart');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(cors({ origin: '*' }));

// connect to DB
require('./connection');

// require('./services/NodeCron');

app.use(
  session({
    secret: 'keyboard cat',
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: false,
  }),
);

Product.belongsTo(Category);
Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderID' });
User.hasMany(Cart, { as: 'cart', foreignKey: 'userID' });
Cart.belongsTo(User);
Cart.belongsTo(Product);
Category.hasMany(Product, { as: 'products', foreignKey: 'categoryID' });
Order.belongsTo(User);
OrderItem.belongsTo(Order);
OrderItem.belongsTo(Product);

app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(cartRoutes);

app.listen(process.env.PORT, () => console.log('server running on ', process.env.PORT));
