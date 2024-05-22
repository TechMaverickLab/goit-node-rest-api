const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContactInfo,
  updateContactFavorite,
} = require("../controllers/contactsControllers");
const {
  contactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require("../schemas/contactsSchemas");
const validateBody = require("../helpers/validateBody");

router.get("/", getAllContacts);
router.get("/:id", getContact);
router.post("/", validateBody(contactSchema), createContact);
router.delete("/:id", deleteContact);
router.put("/:id", validateBody(updateContactSchema), updateContactInfo);
router.patch(
  "/:id/favorite",
  validateBody(updateFavoriteSchema),
  updateContactFavorite,
);

module.exports = router;
