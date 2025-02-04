import { registerUser } from '../services/users.js';
import { serializeUser } from '../utils/serializeUser.js';

export const registerUserController = async (req, res) => {
  const { body } = req;

  const user = await registerUser(body);

  res.json({
    status: 200,
    message: 'Successfully created a user',
    data: serializeUser(user),
  });
};
