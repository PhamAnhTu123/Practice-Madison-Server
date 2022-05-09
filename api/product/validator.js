const Joi = require('joi');

module.exports.idParams = Joi.object({
  id: Joi.string().required()
})