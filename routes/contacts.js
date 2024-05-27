const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContactInfo,
  updateContactFavorite,
} = require('../controllers/contactsControllers');
const {
  contactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require('../schemas/contactsSchemas');
const validateBody = require('../helpers/validateBody');
const auth = require('../middlewares/auth');

router.get('/', auth, getAllContacts);
router.get('/:id', auth, getContact);
router.post('/', auth, validateBody(contactSchema), createContact);
router.delete('/:id', auth, deleteContact);
router.put('/:id', auth, validateBody(updateContactSchema), updateContactInfo);
router.patch(
  '/:id/favorite',
  auth,
  validateBody(updateFavoriteSchema),
  updateContactFavorite,
);

module.exports = router;
