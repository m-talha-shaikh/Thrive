const executeQuery = require('../utils/executeQuery');
exports.getComments = async (req, res) => {
    console.log(req.query.postId);
    try {
        const q = `SELECT c.*,u.user_id,username,u.ProfilePic from comments AS c JOIN user AS u ON (u.user_id= c.user_id) 
        Where c.post_id = ?
        ORDER BY c.comment_date DESC`;
   const comment = await executeQuery(req.db, q, [req.query.postId]);
   return res.status(200).json(comment);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
     
}