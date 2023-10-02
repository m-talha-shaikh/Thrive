const express = require('express')
const organizationController = require('../controllers/organizationController')

const router = express.Router();

router
    .route('/:organizationId')
    .get(organizationController.getOrganization)

module.exports = router;