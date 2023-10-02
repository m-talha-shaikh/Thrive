const express = require('express')
const instituteController = require('../controllers/instituteController')

const router = express.Router();

router
    .route('/:institute_id')
    .get(instituteController.getInstitute)

module.exports = router;