const Joi = require('joi');

module.exports.createOrder = Joi.object({
  items: Joi.array().items({
    productID: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
  }).required(),
  payment: Joi.string().required(),
});

module.exports.updateOrder = Joi.object({
  items: Joi.array().items({
    productID: Joi.number(),
    quantity: Joi.number().min(1),
  }),
});

module.exports.requireAuthen = Joi.object({
  authorization: Joi.string().required(),
});

module.exports.payloadSubmit = Joi.object({
  type: Joi.valid('visa', 'cash').required(),
});
