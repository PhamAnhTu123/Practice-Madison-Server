const Joi = require('joi');

module.exports.idParams = Joi.object({
  id: Joi.string().required(),
});

module.exports.createProduct = Joi.object({
  name: Joi.string().required(),
  categoryID: Joi.number().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
});

module.exports.updateProduct = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
});
