const express = require('express');
const { getLikes, postLikes, deleteLikes } = require('../controllers/Like');
const router = express.Router();

router.route("/")
  .get(getLikes)
  .post(postLikes);

  router.delete("/", deleteLikes);

module.exports = router;
