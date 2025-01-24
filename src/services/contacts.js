import createHttpError from "http-errors";
import { contactsCollection } from "../db/models/Contacts.js";

// export const getAllContacts = async () => {
//     const contacts = await contactsCollection.find();
//     return contacts;
// };

export const getAllContacts = () => contactsCollection.find();

// export const getContactById = (contactId) => contactsCollection.findById(contactId);

export const getContactById = async (contactId) => {
    const contact = await contactsCollection.findById(contactId);

  if (!contact) {
            throw new createHttpError(404, "Something wrong");
                 }
            return contact;
        };


export const createContact = (contactData) => contactsCollection.create(contactData);

export const deleteContactById = async (contactId) => {
  await contactsCollection.findByIdAndDelete(contactId);
};
