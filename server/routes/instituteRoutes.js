const express = require('express');
const instituteController = require('../controllers/instituteController');

const router = express.Router();

router.route('/:user_id').get(instituteController.getInstitute);

router.route('/:user_id').put(instituteController.updateInstitute);

router.route('/:user_id/affiliates').get(instituteController.getAffiliates);

module.exports = router;
