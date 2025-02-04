import { Router } from 'express';
import { registerUserController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserValidationSchema } from '../validation/registerUser.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserValidationSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post('/login');
authRouter.post('/refresh-session');
authRouter.post('/logout');

export default authRouter;
