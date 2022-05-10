const express = require('express');

const controller = require('./controller');

const routes = express.Router();

routes.post('/api/v1/orders', controller.createOrder);

module.exports = routes;
