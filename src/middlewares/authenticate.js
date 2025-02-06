import createHttpError from 'http-errors';
import { sessionCollection } from '../db/models/session.js';
import { userCollection } from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  try {
    if (!authHeader) {
      throw new createHttpError(401, 'Access token expired');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer') {
      throw new createHttpError(
        401,
        'Authorization header should be of Bearer type',
      );
    }

    if (!token) {
      throw new createHttpError(401, 'No Access token provided');
    }

    const session = await sessionCollection.findOne({ accessToken: token });

    if (!session) {
      throw new createHttpError(401, 'No active session found');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw new createHttpError(401, 'Access token expired');
    }
    const user = await userCollection.findById(session.userId);

    if (!user) {
      await sessionCollection.findByIdAndDelete(session._id);
      throw new createHttpError(401, 'No usr found such session');
    }
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
