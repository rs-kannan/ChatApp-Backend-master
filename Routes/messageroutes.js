const express = require('express');
const { sendMessage, allMessages } = require('../Controller/messageController');
const { protect } = require('../Middleware/authMiddelware');

const router = express.Router();

router.route('/:chatId').get(protect, allMessages);
router.route('/').post(protect, sendMessage);

module.exports = router;
