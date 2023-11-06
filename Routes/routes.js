const express = require('express');
const {
  registerUser,
  authUser,
  allUsers,
} = require('../Controller/controller');
const { protect } = require('../Middleware/authMiddelware');

const router = express.Router();

router.route('/').get(protect, allUsers);
router.route('/').post(registerUser);
router.post('/login', authUser);

module.exports = router;
