import Joi from 'joi';

export const requestResetPasswordValidationSchema = Joi.object({
  email: Joi.string().required().email(),
});
