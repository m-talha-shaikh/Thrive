const express = require('express')
// const jobController = require('../controllers/jobController')
const authController = require('./../controllers/authController');

const router = express.Router();

//Only Authentication Needed
router
    .route('/:job_id')
    .get(authController.protect, jobController.getJob)

module.exports = router;