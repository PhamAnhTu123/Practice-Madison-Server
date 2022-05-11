const express = require('express');
const { idParams } = require('../product/validator');
// eslint-disable-next-line import/order
const validator = require('express-joi-validation').createValidator({});
const upload = require('../../services/Multer');

const controller = require('./controller');
const { createCategory, updateCategory } = require('./validator');

const routes = express.Router();

routes.get('/api/v1/categories', controller.getAll);
routes.get('/api/v1/categories/:id', validator.params(idParams), controller.getOne);
routes.post('/api/v1/categories', upload.single('file'), validator.body(createCategory), controller.createOne);
routes.put('/api/v1/categories/:id', upload.single('file'), validator.body(updateCategory), controller.updateOne);
routes.delete('/api/v1/categories/:id', validator.params(idParams), controller.deletedOne);

module.exports = routes;
