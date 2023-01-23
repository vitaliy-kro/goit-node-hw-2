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
  favorite: Joi.boolean(),
}).min(3);

const updadeContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  phone: JoiNumberValidation.string().phoneNumber(),
}).min(1);

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  addContactSchema,
  updadeContactSchema,
  updateFavoriteSchema,
};
