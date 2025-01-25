import { Router } from 'express';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import createHttpError from 'http-errors';
import {
  deleteContactByIdController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  putContactController,
} from '../controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get(
  '/contacts',
  ctrlWrapper(async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      data: contacts,
      message: 'Successfully found contacts!',
    });
  }),
);

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  }),
);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:studentId', ctrlWrapper(getContactByIdController));

contactsRouter.patch('/:contactId', ctrlWrapper(patchContactController));

contactsRouter.put('/:contactId', ctrlWrapper(putContactController));

contactsRouter.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactByIdController),
);

export default contactsRouter;
