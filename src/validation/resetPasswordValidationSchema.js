import Joi from 'joi';

export const resetPasswordValidationSchema = Joi.object({
  password: Joi.string().required().min(5).max(20),
  token: Joi.string().required(),
});
