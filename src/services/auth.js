import createHttpError from 'http-errors';
import { userCollection } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { sessionCollection } from '../db/models/session.js';
import crypto from 'node:crypto';

const createSession = () => ({
  accessToken: crypto.randomBytes(20).toString('base64'),
  refreshToken: crypto.randomBytes(20).toString('base64'),
  refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
});

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
    ...createSession(),
    userId: user._id,
  });
  return session;
};

export const logoutUser = async ({ sessionToken, sessionId }) => {
  await sessionCollection.deleteOne({
    refreshToken: sessionToken,
    _id: sessionId,
  });
};

export const refreshSession = async ({ sessionToken, sessionId }) => {
  const session = await sessionCollection.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw new createHttpError(401, 'Can not refresh a session');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError(401, 'Session token expired');
  }

  const user = await userCollection.findById(session.userId);
  if (!user) {
    throw new createHttpError(401, 'Session user is not found');
  }

  await sessionCollection.findByIdAndDelete(session._id);

  const newSession = await sessionCollection.create({
    ...createSession(),
    userId: session.userId,
  });
  return newSession;
};
