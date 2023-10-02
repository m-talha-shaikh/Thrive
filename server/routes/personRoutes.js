const express = require('express')
const personController = require('../controllers/personController')

const router = express.Router();

router
    .route('/:person_id')
    .get(personController.getPerson)

router
    .route('/:person_id/education')
    .post(personController.createEducation)

// router
//     .route('/:person_id/employment')
//     .post(personController.createEmployment)

// router
//     .route('/:person_id/certification')
//     .post(personController.createCertification)


module.exports = router;