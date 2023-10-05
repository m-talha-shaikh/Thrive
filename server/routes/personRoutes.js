const express = require('express')
const personController = require('./../controllers/personController')
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/:user_id')
    .get(personController.getPerson)

router
    .route('/:user_id/education')
    .post(authController.protect, personController.createEducation)

router
    .route('/:user_id/employment')
    .post(authController.protect, personController.createEmployment)

router
    .route('/:user_id/certification')
    .post(authController.protect, personController.createCertification)


module.exports = router;