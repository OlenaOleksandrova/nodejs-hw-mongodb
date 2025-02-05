import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { notFoundHandlerMiddleware } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // app.use(contactsRouter);

  app.use('/contacts', contactsRouter);

  app.use('/auth', authRouter);

  app.use('*', notFoundHandlerMiddleware);

  app.use(errorHandlerMiddleware);

  // app.use('*', (req, res, next) => {
  //     res.status(404).json({
  //         message: "Not found",
  // });
  //  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
