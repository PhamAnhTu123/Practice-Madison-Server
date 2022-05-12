const Joi = require('joi');

module.exports.createCategory = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports.updateCategory = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  productQuantity: Joi.number(),
});
