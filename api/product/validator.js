const Joi = require('joi');

module.exports.idParams = Joi.object({
  id: Joi.string().required(),
});

module.exports.createProduct = Joi.object({
  name: Joi.string().required(),
  categories: Joi.array().items(Joi.number()).required(),
  description: Joi.string().required(),
  storage: Joi.number().min(0).required(),
  price: Joi.number().required(),
});

module.exports.updateProduct = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  storage: Joi.number().min(0),
  price: Joi.number(),
});
