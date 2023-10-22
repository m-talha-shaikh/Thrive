const express = require('express');
const { tokesignup, login, logout } = require("../controllers/authController.js");

const router = express.Router();

// Signup route
router.post("/signup", tokesignup);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

module.exports = router;
