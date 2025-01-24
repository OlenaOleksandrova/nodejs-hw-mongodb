import createHttpError from "http-errors";
import { createContact, deleteContactById, getAllContacts, getContactById, updateContact } from "../services/contacts.js";

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

export const patchContactController = async (req, res) => {
    const {contactId} = req.params;
    const {body} = req;

    const contact = await updateContact(contactId, body);

    res.json({
        status: 200,
	message: "Successfully patched a contact!",
	data: contact,
    });
};

export const deleteContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;

    await deleteContactById(contactId);


    res.status(204).send();
};
