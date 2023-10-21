const express = require('express');
const {getPost,addPost,deletePost} = require('../controllers/post');

const router = express.Router();
router.post("/uploadPost",addPost);
router.get("/getPost/:userId",getPost);
router.delete("/",deletePost);
module.exports = router;