import express from "express";
import pino from "pino-http";
import cors from "cors";
import { getEnvVar } from "./utils/getEnvVar.js";
import { createContactController, getAllContactsController, getContactByIdController } from "./controllers/contacts.js";
import contactsRouter from "./routers/contacts.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.js";
import { notFoundHandlerMiddleware } from "./middlewares/notFoundHandler.js";


const PORT = Number(getEnvVar("PORT", "3000"));

export const setupServer = () => {
    const app = express();

     app.use(express.json());

    app.use(cors());

    app.get('/contacts', getAllContactsController);

    app.get('/contacts/:contactId', getContactByIdController);

    app.post('/contacts', createContactController);

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.use(contactsRouter);

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandlerMiddleware);

  app.use(errorHandlerMiddleware);

    app.use(express.json());
    app.use(cors());
    app.use('*', (req, res, next) => {
        res.status(404).json({
            message: "Not found",
    });
     });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
