const express = require('express')
const personController = require('../controllers/personController')

const router = express.Router();

router
    .route('/:personId')
    .get(personController.getPerson)

module.exports = router;