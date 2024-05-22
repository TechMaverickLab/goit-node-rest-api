const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../services/contactsServices");
const { HttpError } = require("../helpers/HttpError");

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContactInfo = async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.id, req.body);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContactInfo,
};
