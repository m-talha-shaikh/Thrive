import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Comments from "../comments/comments";
import "./Post.scss"
import { Link } from 'react-router-dom';

import { useState } from "react";
import moment from "moment";

const Post = ({ post }) => {
    console.log(post);
    const Liked = false;
    const [commentdisplay,setCommentdisplay] = useState(false);
    return (
      <div className="post">
        <div className="container">

        <div className="user">
          <div className="userinfo">
            <img src={post.ProfilePic} alt="" />
            <div className="details">
                <Link to={`/profile/${post.user_id}`} style={{textDecoration:"none",color:"inherit"}}>
                    <span>{post.username}</span>
                    <div className="date">{moment(post.post_date).fromNow()}</div>
                </Link>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
            <p>{post.content}</p>
            <img src={"../../../public/uploads/"+post.image_url} alt="" />
        </div>
        <div className="info">
         <div className="item">
            {Liked ?   <FavoriteOutlinedIcon/>:<FavoriteBorderOutlinedIcon/>}
            <span>12 Likes</span>
         </div>
         <div className="item" onClick={()=>setCommentdisplay(!commentdisplay)}>
         <TextsmsOutlinedIcon />
            <span>Comments</span>
         </div>
         <div className="item">
         <ShareOutlinedIcon />
            <span>Share</span>
         </div>
        </div>
        {commentdisplay && <Comments/>}
      </div>
        </div>
    );
  };
  
  export default Post;