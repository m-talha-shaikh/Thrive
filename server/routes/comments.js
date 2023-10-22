const express = require('express');
const { getComments, addComments } = require('../controllers/comment');
const router = express.Router();

router.get('/', getComments);
router.post('/', addComments);

module.exports = router;
