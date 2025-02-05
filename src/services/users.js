import createHttpError from 'http-errors';
import { userCollection } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { sessionCollection } from '../db/models/session.js';
import crypto from 'node:crypto';

export const registerUser = async ({ email, password, name }) => {
  let user = await userCollection.findOne({ email });

  if (user) {
    throw new createHttpError(409, 'User already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await userCollection.create({ email, password: hashedPassword, name });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw new createHttpError(404, 'User not found');
  }
  const arePasswordEqua = await bcrypt.compare(password, user.password);

  if (!arePasswordEqua) {
    throw new createHttpError(404, 'Login or password is incorrect!');
  }
  await sessionCollection.deleteOne({ userId: user._id });

  const session = await sessionCollection.create({
    accessToken: crypto.randomBytes(20).toString('base64'),
    refreshToken: crypto.randomBytes(20).toString('base64'),
    userId: user._id,
    refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
  });
  return session;
};

export const logoutUser = async ({ sessionToken, sessionId }) => {
  await sessionCollection.deleteOne({ refreshToken: sessionToken, sessionId });
};
