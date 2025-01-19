import { contactsCollection } from "../db/models/Contacts.js";

// export const getAllContacts = async () => {
//     const contacts = await contactsCollection.find();
//     return contacts;
// };

export const getAllContacts = () => contactsCollection.find();
export const getContactById = (contactId) => contactsCollection.findById(contactId);
