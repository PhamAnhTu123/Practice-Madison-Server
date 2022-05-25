const Joi = require('joi');

module.exports.addToCart = Joi.object({
  productID: Joi.number().required(),
  quantity: Joi.number().min(1).required(),
});

module.exports.updateCart = Joi.object({
  productID: Joi.number(),
  quantity: Joi.number().min(0),
});
