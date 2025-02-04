import createHttpError from 'http-errors';
import { userCollection } from '../db/models/User.js';
import bcrypt from 'bcrypt';

export const registerUser = async ({ email, password, name }) => {
  let user = await userCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'User already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await userCollection.create({ email, password: hashedPassword, name });

  return user;
};
