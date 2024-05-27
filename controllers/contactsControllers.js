const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../services/contactsServices");
const { createError } = require("../helpers/HttpError");
const mongoose = require("mongoose");

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts({ owner: req.user._id });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }
    const contact = await getContactById(id);
    if (!contact || contact.owner.toString() !== req.user._id.toString()) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone, req.user._id);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }
    const contact = await removeContact(id, req.user._id);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContactInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }
    const contact = await updateContact(id, req.body, req.user._id);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContactFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }
    const { favorite } = req.body;
    const contact = await updateContact(id, { favorite }, req.user._id);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
      return;
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
  updateContactFavorite,
};
