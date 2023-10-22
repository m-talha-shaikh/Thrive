const express = require('express');
const { getFriends, addFriend, deletefriend } = require('../controllers/Connection');
const router = express.Router();

router.route("/")
      .get(getFriends)
      .post(addFriend)
      .delete(deletefriend);

module.exports = router;