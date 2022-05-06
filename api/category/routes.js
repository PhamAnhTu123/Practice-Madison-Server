const express = require('express');
const validator = require('express-joi-validation').createValidator({})

const controller = require('./controller');

const routes = express.Router();

routes.get('/api/v1/categories', controller.getAll);

module.exports = routes;