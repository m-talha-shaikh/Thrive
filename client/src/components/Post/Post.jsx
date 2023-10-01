import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "./Post.scss"
import { Link } from 'react-router-dom';
const Post = ({ post }) => {
    const Liked = false;
    return (
      <div className="post">
        <div className="container">

        <div className="user">
          <div className="userinfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
                <Link to={`/profile/${post.userId}`} style={{textDecoration:"none",color:"inherit"}}>
                    <span>{post.name}</span>
                    <div className="date">1 min ago</div>
                </Link>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
            <p>{post.desc}</p>
            <img src={post.img} alt="" />
        </div>
        <div className="info">
         <div className="item">
            {Liked ?   <FavoriteOutlinedIcon/>:<FavoriteBorderOutlinedIcon/>}
            <span>12 Likes</span>
         </div>
         <div className="item">
         <TextsmsOutlinedIcon />
            <span>Comments</span>
         </div>
         <div className="item">
         <ShareOutlinedIcon />
            <span>Share</span>
         </div>
        </div>
      </div>
        </div>
    );
  };
  
  export default Post;