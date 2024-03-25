const express = require('express');

const { signup, login, logout, userType, generateOTP, verifyOTP } = require("../controllers/authController.js");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Generate OTP
router.post("/generateOTP", generateOTP);

// Generate OTP
router.post("/verifyOTP", verifyOTP);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

//User Type
router.get("/userType/:id", userType);


module.exports = router;
