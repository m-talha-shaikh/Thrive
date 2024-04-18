const express = require('express');
const authController = require('./../controllers/authController');
const messageController = require('./../controllers/Chat');

const router = express.Router({ mergeParams: true });

// Middleware for protecting routes
// router.use('/:conversation_id', authController.protect);

router.route('/messages')
  .post(messageController.storeMessage);

router.route('/messages')
  .get(messageController.getMessages);

module.exports = router;
