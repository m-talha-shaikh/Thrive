const express = require('express')
const organizationController = require('../controllers/organizationController')

const router = express.Router();

router
    .route('/:user_id')
    .get(organizationController.getOrganization)

router
    .route('/:user_id/employees')
    .get(organizationController.getEmployees)

module.exports = router;