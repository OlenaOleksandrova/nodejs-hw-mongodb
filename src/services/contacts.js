import createHttpError from 'http-errors';
import { contactsCollection } from '../db/models/Contacts.js';

// export const getAllContacts = async () => {
//     const contacts = await contactsCollection.find();
//     return contacts;
// };

const createPaginationMetadata = (page, perPage, totalItems) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page !== 1 && page <= totalPages + 1;
  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getAllContacts = async ({
  userId,
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const offset = (page - 1) * perPage;

  const filtersQuery = contactsCollection.find({ userId });

  if (filter.type) {
    filtersQuery.where('contactType').equals(filter.type);
  }

  if (typeof filter.isFavourite === 'boolean') {
    filtersQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsQuery = contactsCollection
    .find({ userId })
    .merge(filtersQuery)
    .skip(offset)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const contactsCountQuery = contactsCollection
    .find({ userId })
    .merge(filtersQuery)
    .countDocuments();

  const [contacts, contactsCount] = await Promise.all([
    contactsQuery,
    contactsCountQuery,
  ]);

  const paginationMetadata = createPaginationMetadata(
    page,
    perPage,
    contactsCount,
  );

  return {
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      contacts,
      ...paginationMetadata,
    },
  };
};

// export const getContactById = (contactId) => contactsCollection.findById(contactId);

export const getContactById = async (contactId, userId) => {
  const contact = await contactsCollection.findOne({ _id: contactId, userId });

  if (!contact) {
    throw new createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = (contactData) =>
  contactsCollection.create(contactData);

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const contactUp = await contactsCollection.findByOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    payload,
    { new: true, ...options },
  );

  if (!contactUp) {
    throw new createHttpError(404, 'Contact not found');
  }
  return contactUp;
};

export const deleteContactById = async (contactId, userId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  if (!contact) {
    throw new createHttpError(404, 'Contact does not belong to user');
  }
  return contact;
};
