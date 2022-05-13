const Joi = require('joi');

module.exports.addToCart = Joi.object({
  productID: Joi.number().required(),
  quantity: Joi.number().required(),
});

module.exports.updateCart = Joi.object({
  productID: Joi.number(),
  quantity: Joi.number(),
});
