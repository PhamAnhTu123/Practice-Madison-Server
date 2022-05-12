const express = require('express');
const validator = require('express-joi-validation').createValidator({});

const controller = require('./controller');
const { idParams, createProduct } = require('./validator');
const upload = require('../../services/Multer');
const { isAuth } = require('../../middlewares/isAuth');

const routes = express.Router();

routes.get('/api/v1/products', controller.getAll);
routes.get('/products', controller.getAllForAdmin);
routes.get('/products/creates', isAuth, controller.createProduct);
routes.get('/products/:id', isAuth, controller.getOneForAdmin);
routes.get('/api/v1/products/:id', validator.params(idParams), controller.getOne);
routes.post('/api/v1/products', isAuth, upload.single('file'), validator.body(createProduct), controller.createOne);
routes.post('/api/v1/products/:id/update', isAuth, upload.single('file'), validator.params(idParams), controller.updateOne);
routes.post('/api/v1/products/:id/delete', isAuth, validator.params(idParams), controller.deletedOne);

module.exports = routes;
