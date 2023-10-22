const express = require('express');
const personController = require('./../controllers/personController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

//THIS ROUTE IS KEPT BEFORE ROUTER.USE BECAUSE VIEWING USER SHOULD NEITHER REQUIRE
//AUTHENTICAION OR AUTHORIZATION DONTTTTTTTT CHANGE ORDER !!!!!!!
router.route('/:user_id').get(personController.getPerson);


// router.use('/:user_id', authController.protect, authController.restrictTo('person'), authController.authorize);
router.route('/:user_id/education')
  .post(personController.createEducation);

router.route('/')
  .put(personController.UpdatePerson);


router
  .route('/:user_id/education/:education_id')
  .patch(personController.updateEducation)
  .delete(personController.deleteEducation);

router.route('/:user_id/employment').post(personController.createEmployment);

router
  .route('/:user_id/employment/:employment_id')
  .patch(personController.updateEmployment)
  .delete(personController.deleteEmployment);

router
  .route('/:user_id/certification')
  .post(personController.createCertification);

router
  .route('/:user_id/certification/:certification_id')
  .patch(personController.updateCertification)
  .delete(personController.deleteCertification);

module.exports = router;
