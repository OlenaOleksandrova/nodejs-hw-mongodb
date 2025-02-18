import { Router } from 'express';
import {
  getGoogleOAuthUrlController,
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  requestResetPasswordEmailController,
  resetPasswordController,
  verifyGoogleOAuthCodeController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserValidationSchema } from '../validation/registerUser.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js';
import { requestResetPasswordValidationSchema } from '../validation/requestResetPasswordEmailValidationSchema.js';
import { resetPasswordValidationSchema } from '../validation/resetPasswordValidationSchema.js';
import { verifyGoogleOAuthCodeValidationSchema } from '../validation/verifyGoogleOAuthCodeValidationSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserValidationSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  validateBody(loginUserValidationSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/refresh', ctrlWrapper(refreshSessionController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetPasswordValidationSchema),
  ctrlWrapper(requestResetPasswordEmailController),
);
authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordValidationSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.post(
  '/get-google-oauth-url',
  ctrlWrapper(getGoogleOAuthUrlController),
);
authRouter.post(
  '/verify-google-oauth-code',
  validateBody(verifyGoogleOAuthCodeValidationSchema),
  ctrlWrapper(verifyGoogleOAuthCodeController),
);

export default authRouter;
