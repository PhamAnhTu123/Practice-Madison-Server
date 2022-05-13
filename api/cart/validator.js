const Joi = require('joi');

module.exports.addToCart = Joi.object({
  productID: Joi.string().required(),
  quantity: Joi.number().required(),
});

module.exports.updateCart = Joi.object({
  productID: Joi.string(),
  quantity: Joi.number(),
});
