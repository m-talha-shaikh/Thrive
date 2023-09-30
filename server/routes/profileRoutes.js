const express = require('express')
const profileController = require('./../controllers/profileController')

const router = express.Router();

router
    .route('/:profileId')
    .get(profileController.getProfile)

module.exports = router;