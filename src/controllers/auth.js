import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';

const setupSessionCookies = (session, res) => {
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerUserController = async (req, res) => {
  const { body } = req;

  const user = await registerUser(body);

  res.json({
    status: 200,
    message: 'Successfully registered a user!',
    data: serializeUser(user),
  });
};

export const loginUserController = async (req, res) => {
  const { body } = req;

  const session = await loginUser(body);

  setupSessionCookies(session, res);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const session = await refreshSession({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });

  setupSessionCookies(session, res);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });
  res.clearCookie('sessionToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};
