const Contact = require("../schemas/contactModel");

async function listContacts(filter) {
  return await Contact.find(filter);
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

async function removeContact(contactId, ownerId) {
  const contact = await Contact.findOneAndDelete({ _id: contactId, owner: ownerId });
  return contact;
}

async function addContact(name, email, phone, owner) {
  const { nanoid } = await import("nanoid");
  const newContact = new Contact({ id: nanoid(), name, email, phone, owner });
  await newContact.save();
  return newContact;
}

async function updateContact(id, body, ownerId) {
  const contact = await Contact.findOneAndUpdate({ _id: id, owner: ownerId }, body, { new: true });
  return contact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
