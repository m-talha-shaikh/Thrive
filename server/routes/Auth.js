const express = require('express');

const { signup, login, logout, accountType, generateOTP, verifyOTP, changePassword } = require("../controllers/authController.js");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Generate OTP
router.post("/generateOTP", generateOTP);

// Veirfy OTP
router.post("/verifyOTP", verifyOTP);

// Change Password
router.post("/changePassword", changePassword);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

//User Type
router.get("/accountType/:id", accountType);


module.exports = router;
