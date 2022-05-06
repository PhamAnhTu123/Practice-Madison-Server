const Joi = require('joi');

module.exports.loginPayload = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports.updateUserPayload = Joi.object({
  fullname: Joi.string().max(50),
  gender: Joi.string().valid('male', 'female'),
  phone: Joi.string().max(11),
  avatar: Joi.string(),
  birthday: Joi.date()
});