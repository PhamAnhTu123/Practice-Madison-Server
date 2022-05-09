const express = require('express');
const validator = require('express-joi-validation').createValidator({})

const controller = require('./controller');
const { idParams } = require('./validator');

const routes = express.Router();

routes.get('/api/v1/products', controller.getAll);
routes.get('/api/v1/products/:id', validator.params(idParams) , controller.getOne);
routes.put('/api/v1/products/:id', validator.params(idParams), controller.updateOne);

module.exports = routes;