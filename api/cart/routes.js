const express = require('express');
const validator = require('express-joi-validation').createValidator({});

const { requireAuthen } = require('../user/validator');
const controller = require('./controller');
const { addToCart, updateCart } = require('./validator');

const routes = express.Router();

routes.get('/api/v1/users/me/carts', validator.headers(requireAuthen), controller.getCart);
routes.post('/api/v1/carts', validator.body(addToCart), controller.addToCart);
routes.put('/api/v1/carts', validator.body(updateCart), controller.updateCart);

module.exports = routes;
