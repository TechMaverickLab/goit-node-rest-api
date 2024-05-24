const Contact = require("../schemas/contactModel");

async function listContacts() {
  return await Contact.find({});
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

async function removeContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
}

async function addContact(name, email, phone) {
  const { nanoid } = await import("nanoid");
  const newContact = new Contact({ id: nanoid(), name, email, phone });
  await newContact.save();
  return newContact;
}

async function updateContact(id, body) {
  const contact = await Contact.findByIdAndUpdate(id, body, { new: true });
  return contact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
