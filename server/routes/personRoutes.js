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
    .route('/:user_id/education/:education_id')
    .post(authController.protect, personController.updateEducation)
    .delete(authController.protect, personController.deleteEducation)

router
    .route('/:user_id/employment')
    .post(authController.protect, personController.createEmployment)

router
    .route('/:user_id/employment/:employment_id')
    .post(authController.protect, personController.updateEmployment)
    .delete(authController.protect, personController.deleteEmployment)

router
    .route('/:user_id/certification')
    .post(authController.protect, personController.createCertification)

router
    .route('/:user_id/certification/:certification_id')
    .post(authController.protect, personController.updateCertification)
    .delete(authController.protect, personController.deleteCertification)


module.exports = router;