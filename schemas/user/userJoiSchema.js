const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(3).max(20).required(),
});

const loginSchema = Joi.object({
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
  registerSchema,
  loginSchema,
  subscriptionUpdateSchema,
  resendValidationSchema,
};
