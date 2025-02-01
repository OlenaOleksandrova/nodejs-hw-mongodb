import Joi from 'joi';

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.number,
  email: Joi.string(),
  contactType: Joi.string(),
});
