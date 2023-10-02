const express = require('express')
const instituteController = require('../controllers/instituteController')

const router = express.Router();

router
    .route('/:instituteId')
    .get(instituteController.getInstitute)

module.exports = router;