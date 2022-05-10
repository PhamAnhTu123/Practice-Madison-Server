const express = require('express');
// eslint-disable-next-line import/order
const validator = require('express-joi-validation').createValidator({});

const controller = require('./controller');
const { createOrder, requireAuthen } = require('./validator');

const routes = express.Router();

routes.post('/api/v1/orders', validator.headers(requireAuthen), validator.body(createOrder), controller.createOrder);
routes.get('/api/v1/orders', validator.headers(requireAuthen), controller.getAll);

module.exports = routes;
