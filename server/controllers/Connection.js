const executeQuery = require("../utils/executeQuery")
const moment = require("moment")
exports.getFriends =async (req,res)=>
{

    try {
        const q = `Select friend_id from friends where user_id = ?`;
   const friends = await executeQuery(req.db, q, [req.query.user_id]);
 
   return res.status(200).json(friends.map(friend=>friend.friend_id));
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}
exports.getFriends2 =async (req,res)=>
{
 
    try {
        const q = `Select user_id,ProfilePic,CoverPic,username From user where user_id IN (Select friend_id from friends where user_id=?)`;
   const friends = await executeQuery(req.db, q, [req.query.userId]);
   return res.status(200).json(friends);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}
exports.getUsernotFriends =async (req,res)=>
{
   

 
    try {
        const q = `Select user_id,ProfilePic,CoverPic,username From user where user_id NOT IN (Select friend_id from friends where user_id=?) AND user_id != ?`;
   const friends = await executeQuery(req.db, q, [req.query.userId,req.query.userId]);

   return res.status(200).json(friends);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}
exports.addFriend =async (req,res)=>
{
    try {
        // console.log(req.body);
        const q = "INSERT INTO friends (`user_id`, `friend_id`,`friendship_date`) VALUES (?)";
        const values =[
            req.body.user_id,
            req.body.friend_id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ];
        const post = await executeQuery(req.db, q, [values]);
        return res.status(200).json("Following");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}
exports.deletefriend =async (req,res)=>
{
   
    try {
        const q = "DELETE FROM friends WHERE `user_id`= ? AND `friend_id`= ? ";
        const post = await executeQuery(req.db, q, [req.query.user_id,req.query.friend_id]);
    
        return res.status(200).json("Unfollwed");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}