import express from "express";
import pino from "pino-http";
import cors from "cors";
import { getEnvVar } from "./utils/getEnvVar.js";
import { getAllContacts, getContactById } from "./services/contacts.js";


const PORT = Number(getEnvVar("PORT", "3000"));

export const setupServer = () => {
    const app = express();

     app.use(express.json());

    app.use(cors());

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            res.status(404).json({
                message: 'Contact not found',
            });
            return;
        }
        res.status(200).json({
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
});

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

    app.use(express.json());
    app.use(cors());
    app.subscribe('*', (req, res, next) => {
        res.status(404).json({
            message: "Not found",
    });
     });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
