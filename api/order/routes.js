const express = require('express');
// eslint-disable-next-line import/order
const validator = require('express-joi-validation').createValidator({});

const controller = require('./controller');
const {
  createOrder, requireAuthen, updateOrder, payloadSubmit,
} = require('./validator');

const routes = express.Router();

routes.post('/api/v1/orders', validator.headers(requireAuthen), validator.body(createOrder), controller.createOrder);
routes.get('/api/v1/orders', validator.headers(requireAuthen), controller.getAll);
routes.get('/api/v1/users/me/orders', validator.headers(requireAuthen), controller.getAllUserOrder);
routes.put('/api/v1/orders/:id', validator.headers(requireAuthen), validator.body(updateOrder), controller.editOrder);
routes.put('/api/v1/orders/:id/submit', validator.headers(requireAuthen), validator.body(payloadSubmit), controller.submitOrder);

module.exports = routes;
