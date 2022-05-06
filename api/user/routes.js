const express = require('express');

const controller = require('./controller');

const routes = express.Router();

routes.get('/api/v1/wellcome', controller.wellcome);
routes.post('/api/v1/users/register', controller.register);
routes.post('/api/v1/users/login', controller.login);
routes.post('/api/v1/users/resend-verify-code', controller.resendVerify);
routes.post('/api/v1/users/forgot-password', controller.forgotPassword);
routes.put('/api/v1/users/verify', controller.verify);
routes.put('/api/v1/users/reset-password', controller.resetPassword);
routes.put('/api/v1/users/change-password', controller.changePassword);

module.exports = routes;