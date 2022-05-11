const Joi = require('joi');

module.exports.createOrder = Joi.object({
  items: Joi.array().items({
    productID: Joi.number().required(),
    quantity: Joi.number().required(),
  }).required(),
});

module.exports.updateOrder = Joi.object({
  items: Joi.array().items({
    productID: Joi.number(),
    quantity: Joi.number(),
  }),
});

module.exports.requireAuthen = Joi.object({
  authorization: Joi.string().required(),
});
