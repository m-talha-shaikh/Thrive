const executeQuery = require('../utils/executeQuery');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.getPost = async (req, res) => {
  // Access user_id from req.user


//   console.log(req.params);
  // Check if the user is authenticated
  user_id = req.params.userId;

  try {
    const q = `SELECT p.*,u.user_id,username,u.ProfilePic from posts AS p JOIN user AS u ON (u.user_id= p.user_id) 

        LEFT JOIN friends AS f ON (p.user_id = f.friend_id) where f.user_id = ? OR p.user_id =?
         ORDER BY p.post_date DESC`;
    const post = await executeQuery(req.db, q, [user_id, user_id]);
    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json('Internal Server Error');
  }
};
exports.addPost = async (req, res) => {

   
    try {
        const q = "INSERT INTO posts (`user_id`, `content`, `image_url`, `post_date`) VALUES (?)";
        const values =[
            req.body.user_id,
            req.body.content,
            req.body.image_url,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ];
        const post = await executeQuery(req.db, q, [values]);
        return res.status(200).json("Post has been created");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

exports.deletePost = async (req, res) => {
    
    try {
        const q1 = `DELETE FROM likes Where post_id =? `;
        await executeQuery(req.db, q1, [req.query.post_id])
        const q = `DELETE FROM posts Where post_id =? AND user_id = ?`;
        const post = await executeQuery(req.db, q, [req.query.post_id,req.query.user_id]);
        return res.status(200).json("Post has been deleted");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}


