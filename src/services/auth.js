import createHttpError from 'http-errors';
import { userCollection } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import fs from 'node:fs';
import { sessionCollection } from '../db/models/session.js';
import crypto from 'node:crypto';
import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/env.js';
import path from 'node:path';
import { TEMPLATES_DIR_PATH } from '../constants/path.js';

const resetEmailTemplate = fs
  .readFileSync(path.join(TEMPLATES_DIR_PATH, 'reset-password.html'))
  .toString();

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

export const requestResetPasswordEmail = async (email) => {
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw new createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    { sub: user._id, email },
    getEnvVar(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordLink = `${getEnvVar(
    ENV_VARS.FRONTEND_DOMAIN,
  )}/reset-password?token=${token}`;

  const template = Handlebars.compile(resetEmailTemplate);

  const html = template({
    name: user.name,
    link: resetPasswordLink,
  });

  await sendEmail({
    to: email,
    from: getEnvVar(ENV_VARS.SMTP_FROM),
    subject: 'Reset password',
    html,
  });
};

export const resetPassword = async ({ password, token }) => {
  let payload;
  try {
    payload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
  } catch (err) {
    console.error(err);
    throw new createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await userCollection.findById(payload.sub);

  if (!user) {
    throw new createHttpError(404, 'User not found!');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await userCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });
};
