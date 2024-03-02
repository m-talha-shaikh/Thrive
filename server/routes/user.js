// userRoutes.js
const express = require('express');
const router = express.Router();
const {searchUsers} = require('../controllers/UserController');

// Define routes
router.get('/search', searchUsers);
// Add more routes for other operations (create, update, delete)

module.exports = router;
