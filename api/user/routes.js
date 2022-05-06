const express = require('express');

const controller = require('./controller');

const routes = express.Router();

routes.get('/api/v1/wellcome', controller.wellcome);
routes.post('/api/v1/users/register', controller.register);
routes.post('/api/v1/users/login', controller.login);
routes.post('/api/v1/users/resend-verify-code', controller.resendVerify);
routes.put('/api/v1/users/verify', controller.verify);

module.exports = routes;