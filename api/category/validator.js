const Joi = require('joi');

module.exports.createCategory = Joi.object({
  name: Joi.string().required(),
  thumbnail: Joi.string().required(),
  description: Joi.string().required(),
  productQuantity: Joi.number().required(),
});

module.exports.updateCategory = Joi.object({
  name: Joi.string(),
  thumbnail: Joi.string(),
  description: Joi.string(),
  productQuantity: Joi.number(),
});
