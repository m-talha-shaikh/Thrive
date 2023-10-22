const express = require('express');
const jobController = require('../controllers/jobController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(
  '/:user_id',
  authController.protect,
  authController.restrictTo('person')
);

//Only Authentication Needed

router.route('/').get(jobController.getJobs);

router.route('/:job_id').get(jobController.getJob);

router.route('/:job_id').post(jobController.applyToJob);

module.exports = router;
