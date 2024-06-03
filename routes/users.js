const express = require('express');
const router = express.Router();
const { register, login, getCurrent, logout, updateSubscription, updateAvatar } = require('../controllers/usersControllers');
const validateBody = require('../helpers/validateBody');
const { userSchema } = require('../schemas/userSchemas');
const auth = require('../middlewares/auth');
const User = require('../schemas/userModel');
const upload = require('../middlewares/upload');

router.post('/register', validateBody(userSchema), register);
router.post('/login', validateBody(userSchema), login);
router.get('/current', auth, getCurrent);
router.post('/logout', auth, logout);
router.patch('/subscription', auth, updateSubscription);
router.patch('/avatars', auth, upload.single('avatar'), updateAvatar); 


  
module.exports = router;
