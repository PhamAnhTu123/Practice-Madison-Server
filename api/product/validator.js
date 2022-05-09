const Joi = require('joi');

module.exports.idParams = Joi.object({
  id: Joi.string().required()
})

module.exports.updateProduct = Joi.object({
  name: Joi.string(),
  thumbnail: Joi.string(),
  description: Joi.string(),
  price: Joi.number()
})