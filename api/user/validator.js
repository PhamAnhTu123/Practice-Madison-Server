const Joi = require('joi');

module.exports.loginPayload = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports.registerPayload = Joi.object({
  email: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports.updateUserPayload = Joi.object({
  fullname: Joi.string().max(50),
  gender: Joi.string().valid('male', 'female'),
  address: Joi.string(),
  phone: Joi.string().max(11),
  birthday: Joi.date(),
});

module.exports.requireAuthen = Joi.object({
  authorization: Joi.string().required(),
});

module.exports.resendVerifyCodePayload = Joi.object({
  email: Joi.string().required(),
});

module.exports.verifyPayload = Joi.object({
  email: Joi.string().required(),
  code: Joi.string().required(),
});

module.exports.resetPasswordPayload = Joi.object({
  email: Joi.string().required(),
  code: Joi.string().required(),
  newPassword: Joi.string().required(),
});

module.exports.changePasswordPayload = Joi.object({
  password: Joi.string().required(),
  newPassword: Joi.string().required(),
});

module.exports.blockOne = Joi.object({
  status: Joi.boolean().required(),
});
