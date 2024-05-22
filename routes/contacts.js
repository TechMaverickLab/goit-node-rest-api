const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContactInfo,
} = require("../controllers/contactsControllers");
const {
  contactSchema,
  updateContactSchema,
} = require("../schemas/contactsSchemas");
const validateBody = require("../helpers/validateBody");

router.get("/", getAllContacts);
router.get("/:id", getContact);
router.post("/", validateBody(contactSchema), createContact);
router.delete("/:id", deleteContact);
router.put("/:id", validateBody(updateContactSchema), updateContactInfo);

module.exports = router;
