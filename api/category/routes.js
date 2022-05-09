const express = require('express');
const { idParams } = require('../product/validator');
const validator = require('express-joi-validation').createValidator({})

const controller = require('./controller');

const routes = express.Router();

routes.get('/api/v1/categories', controller.getAll);
routes.get('/api/v1/categories/:id', validator.params(idParams), controller.getOne);

module.exports = routes;