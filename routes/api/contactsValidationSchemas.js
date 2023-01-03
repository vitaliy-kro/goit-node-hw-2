const Joi = require('joi');
const JoiNumberValidation = Joi.extend(require('joi-phone-number'));

const addContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: JoiNumberValidation.string().phoneNumber().required(),
}).length(3);

const updadeContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  phone: JoiNumberValidation.string().phoneNumber(),
}).min(1);

module.exports = { addContactSchema, updadeContactSchema };
