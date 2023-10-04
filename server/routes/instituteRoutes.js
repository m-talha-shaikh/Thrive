const express = require('express')
const instituteController = require('../controllers/instituteController')

const router = express.Router();

router
    .route('/:user_id')
    .get(instituteController.getInstitute)
    
module.exports = router;