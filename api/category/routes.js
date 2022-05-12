const express = require('express');
const { idParams } = require('../product/validator');
// eslint-disable-next-line import/order
const validator = require('express-joi-validation').createValidator({});
const upload = require('../../services/Multer');

const controller = require('./controller');
const { createCategory, updateCategory } = require('./validator');
const { isAuth } = require('../../middlewares/isAuth');

const routes = express.Router();

routes.get('/api/v1/categories', controller.getAll);
routes.get('/categories', isAuth, controller.getAllForAdmin);
routes.get('/categories/creates', isAuth, (req, res) => res.render('createCategory.ejs'));
routes.get('/categories/:id', isAuth, controller.getOneCategoryForAdmin);
routes.get('/api/v1/categories/:id', validator.params(idParams), controller.getOne);
routes.post('/api/v1/categories', isAuth, upload.single('file'), validator.body(createCategory), controller.createOne);
routes.post('/api/v1/categories/:id/update', isAuth, upload.single('file'), validator.body(updateCategory), controller.updateOne);
routes.post('/api/v1/categories/:id/delete', isAuth, validator.params(idParams), controller.deletedOne);

module.exports = routes;
