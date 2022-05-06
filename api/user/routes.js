const express = require('express');

const controller = require('./controller');

const routes = express.Router();

routes.get('/api/v1/wellcome', controller.wellcome);
routes.post('/api/v1/users/register', controller.register);

module.exports = routes;