const Joi = require('joi');

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(3).max(20).required(),
});

const subscriptionUpdateSchema = Joi.object({
  subscription: Joi.string().required().valid('starter', 'pro', 'business'),
});

const resendValidationSchema = Joi.object({
  email: Joi.string().required(),
});
module.exports = {
  authSchema,
  subscriptionUpdateSchema,
  resendValidationSchema,
};
