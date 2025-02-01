import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
};

// export const isValidId =
//   (name = 'id') =>
//   (req, res, next) => {
//     if (!isValidObjectId(req.params[name])) {
//       next(createHttpError(400, `${name} is not a valid Mongo Id`));
//     }
//     next();
//   };
