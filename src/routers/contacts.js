import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactByIdController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  putContactController,
} from '../controllers/contacts.js';
import { createContactSchema } from '../validation/createContactSchema.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateContactSchema } from '../validation/updateContactSchema.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use('/', authenticate);
// contactsRouter.use('/:contactId', isValidId('contactId'));

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.put(
  '/:contactId',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(putContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactByIdController),
);

export default contactsRouter;
