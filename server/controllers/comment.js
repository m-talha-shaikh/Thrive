const executeQuery = require('../utils/executeQuery');
const moment = require('moment');
exports.getComments = async (req, res) => {
  try {
    const q = `SELECT c.*,u.user_id,username,u.ProfilePic from comments AS c JOIN user AS u ON (u.user_id= c.user_id) 
        Where c.post_id = ?
        ORDER BY c.comment_date DESC`;
    const comment = await executeQuery(req.db, q, [req.query.postId]);
    return res.status(200).json(comment);
  } catch (err) {
    console.log(err);
    return res.status(500).json('Internal Server Error');
  }
};
exports.addComments = async (req, res) => {
  try {
    const q =
      'INSERT INTO comments (`content`, `comment_date`, `post_id`, `user_id`) VALUES (?)';
    const values = [
      req.body.content,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      req.body.postId,
      req.body.user_id,
    ];
    const post = await executeQuery(req.db, q, [values]);
    return res.status(200).json('Comment has been created has been created');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
