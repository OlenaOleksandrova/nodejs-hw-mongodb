import createHttpError from 'http-errors';
import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilters } from '../utils/parseFilters.js';

export const getAllContactsController = async (req, res) => {
  const userId = req.user._id;

  const { page, perPage } = parsePaginationParams(req.query);

  const { sortOrder, sortBy } = parseSortParams(req.query);

  const filter = parseFilters(req.query);

  const contacts = await getAllContacts({
    userId,
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });

  res.status(200).json({
    data: contacts,
    message: 'Successfully found contacts!',
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const newContact = await createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const { body } = req;
  const photo = req.file;

  const contact = await updateContact(
    contactId,
    userId,
    { ...body, photo },
    { upsert: false },
  );

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const putContactController = async (req, res) => {
  const userId = req.user._id;

  const { contactId } = req.params;
  const { body } = req;

  const contact = await updateContact(contactId, userId, body, {
    upsert: true,
  });

  res.json({
    status: 200,
    message: 'Contact is upsert!',
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const contact = await deleteContactById(contactId, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
