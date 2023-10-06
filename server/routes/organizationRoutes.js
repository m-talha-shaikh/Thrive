const express = require('express')
const organizationController = require('../controllers/organizationController')
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/:user_id')
    .get(organizationController.getOrganization)
    .patch(authController.protect, organizationController.updateOrganization)

router
    .route('/:user_id/employees')
    .get(organizationController.getEmployees)

router
    .route('/:user_id/jobs')
    .get(organizationController.getJobs)
    .post(authController.protect, organizationController.createJob)

router
    .route('/:user_id/jobs/job_id')
    .patch(authController.protect, organizationController.updateJob)
    .delete(authController.protect, organizationController.deleteJob)

module.exports = router;