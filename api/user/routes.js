const express = require('express');

const validator = require('express-joi-validation').createValidator({});

const controller = require('./controller');
const upload = require('../../services/Multer');

const {
  loginPayload,
  updateUserPayload,
  requireAuthen, blockOne,
  registerPayload,
  resendVerifyCodePayload,
  verifyPayload,
  resetPasswordPayload,
  changePasswordPayload,
} = require('./validator');
const { isAuth } = require('../../middlewares/isAuth');

const routes = express.Router();

routes.get('/wellcome', controller.wellcome);
routes.get('/auth/:token', controller.authTokenTemplate);
routes.post('/auth/:token', controller.verifyAuthToken);
routes.get('/dashboard', isAuth, controller.dashboard);
routes.get('/admin/login', controller.loginTemplate);
routes.post('/api/v1/test', upload.single('file'), controller.testMultiplepart);
routes.get('/api/v1/users/me', validator.headers(requireAuthen), controller.getMe);
routes.get('/users/:id', isAuth, controller.getOne);
routes.post('/api/v1/users/register', validator.body(registerPayload), controller.register);
routes.post('/api/v1/users/login', validator.body(loginPayload), controller.login);
routes.post('/api/v1/admins/login', validator.body(loginPayload), controller.adminLogin);
routes.post('/api/v1/admins/logout', isAuth, controller.logout);
routes.post('/api/v1/users/resend-verify-code', validator.body(resendVerifyCodePayload), controller.resendVerify);
routes.post('/api/v1/users/forgot-password', validator.body(resendVerifyCodePayload), controller.forgotPassword);
routes.put('/api/v1/users/verify', validator.body(verifyPayload), controller.verify);
routes.put('/api/v1/users/reset-password', validator.body(resetPasswordPayload), controller.resetPassword);
routes.put('/api/v1/users/change-password', validator.headers(requireAuthen), validator.body(changePasswordPayload), controller.changePassword);
routes.put('/api/v1/users/me', upload.single('file'), validator.headers(requireAuthen), validator.body(updateUserPayload), controller.updateMe);
routes.post('/api/v1/users/:id/status', isAuth, validator.body(blockOne), controller.blockOne);
routes.post('/api/v1/users/:id/delete', isAuth, controller.deletedOne);

module.exports = routes;
