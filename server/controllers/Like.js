const executeQuery = require("../utils/executeQuery")
const moment = require("moment")
exports.getLikes =async (req,res)=>
{

    try {
        const q = `Select user_id from Likes where post_id =?`;
   const Likes = await executeQuery(req.db, q, [req.query.postId]);
   return res.status(200).json(Likes.map(like=>like.user_id));
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}
exports.postLikes =async (req,res)=>
{
    try {
        const q = "INSERT INTO Likes (`user_id`, `post_id`,`like_date`) VALUES (?)";
        const values =[
            req.body.user_id,
            req.body.post_id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ];
        const post = await executeQuery(req.db, q, [values]);
        return res.status(200).json("Post has been Liked");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}
exports.deleteLikes =async (req,res)=>
{
    // console.log(req.query);
    try {
        const q = "DELETE FROM Likes WHERE `user_id`= ? AND `post_id`= ? ";
        const post = await executeQuery(req.db, q, [req.query.user_id,req.query.post_id]);
    
        return res.status(200).json("Post has been unLiked");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}