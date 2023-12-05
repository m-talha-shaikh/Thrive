const express = require('express');
const { getFriends, addFriend, deletefriend, getFriends2,getUsernotFriends } = require('../controllers/Connection');
const router = express.Router();

router.route("/")
      .get(getFriends)
      .post(addFriend)
      .delete(deletefriend);
router.route("/messagingfriends").get(getFriends2);
router.route("/UsersNotfriends").get(getUsernotFriends);
module.exports = router;