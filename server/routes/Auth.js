const express = require('express');

const { signup, login, logout, userType } = require("../controllers/authController.js");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

//User Type
router.get("/userType/:id", userType);


module.exports = router;
