import createHttpError from "http-errors";
import { createContact, getAllContacts, getContactById } from "../services/contacts.js";

export const getAllContactsController = async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            data: contacts,
            message: "Successfully found contacts!",
        })
    };
export const getContactByIdController = async (req, res, next) => {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            throw createHttpError(404, "Contact not found");
        }

        // if (!contact) {
        //     res.status(400).json({
        //         status: 404,
        //         message: 'Contact not found',
        //          });
        //     return;
        // }
        res.status(200).json({
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
}
export const createContactController = async (req, res) => {
    const newContact = await createContact(req.body);

    res.status(201).json({
        status: 201,
		message: "Successfully created a contact!",
		data: newContact
    });
};
