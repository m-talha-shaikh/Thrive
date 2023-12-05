const express = require('express');
const organizationController = require('../controllers/organizationController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

//THIS ROUTE IS KEPT BEFORE ROUTER.USE BECAUSE VIEWING USER SHOULD NEITHER REQUIRE
//AUTHENTICAION OR AUTHORIZATION DONTTTTTTTT CHANGE ORDER !!!!!!!
router.route('/:user_id').get(organizationController.getOrganization);

// router.use('/:user_id', authController.protect, authController.restrictTo('organization'), authController.authorize);

router.route('/:user_id').put(organizationController.updateOrganization);

router.route('/:user_id/employees').get(organizationController.getEmployees);

router
  .route('/:user_id/jobs')
  .get(organizationController.getJobs)
  .post(organizationController.createJob);

router
  .route('/:user_id/jobs/:job_id')
  .patch(organizationController.updateJob)
  .delete(organizationController.deleteJob);

module.exports = router;
