import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Comments from "../comments/comments";
import "./Post.scss"
import { Link } from 'react-router-dom';

import { useContext, useState } from "react";
import moment from "moment";
import { useQuery,useQueryClient,useMutation } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/AuthContext";
import { ProfileTypeContext } from '../../context/ProfileTypeContext';

const Post = ({ post }) => {

  const { fetchAccountType } = useContext(ProfileTypeContext);
    
    const [Liked,setLike]= useState(true);
    const [menuOpen,setmenuOpen] = useState(false);
    const [commentdisplay,setCommentdisplay] = useState(false);
    const {currentUser}= useContext(AuthContext);
    const { isLoading, error, data } = useQuery(['Likes',post.post_id], async () => {
      return  await makeRequest.get( `/Likes?postId=${post.post_id}`)
        .then((res) => res.data);
    });
    const queryClient = useQueryClient();

  const mutation = useMutation(
    async (Like) => {
      try {
        if (!Like) {
          const response = await makeRequest.post("/Likes",{user_id :currentUser.data.user.user_id,post_id: post.post_id} );
        return response.data; // Assuming your response contains the new post data
        }
        else{
        
          const response = await makeRequest.delete(`/Likes`, {
            params: {
              post_id: post.post_id,
              user_id:currentUser.data.user.user_id
            }
          });
          return response.data; 
        }
        
      } catch (err) {
        throw err; 
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["Likes"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const deletemutation = useMutation(
    async (poster) => {
      try {
       
        const response = await makeRequest.delete("/Posts", {
          params: {
            user_id: currentUser.data.user.user_id,
            post_id: post.post_id
          }
        });
        
        }
        catch (err) {
        throw err; 
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
    const handleLiked=()=>
    {
      mutation.mutate(data.includes(currentUser.data.user.user_id));
    }
  
     const HandledeletePost = ()=>
     {
      deletemutation.mutate({user_id:currentUser.data.user.user_id ,post_id:post.post_id});
     }
    return (
      <div className="post">
        <div className="container">

        <div className="user">
          <div className="userinfo">
            <img src={"https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/"+post.ProfilePic} alt="" />
            <div className="details">
                {/* <Link to={`/profile/${post.user_id}`} style={{textDecoration:"none",color:"inherit"}}>
                    <span>{post.username}</span>
                    <div className="date">{moment(post.post_date).fromNow()}</div>
                </Link> */}
                <div onClick={() => fetchAccountType(post.user_id)} style={{textDecoration:"none",color:"inherit"}}>
                    <span>{post.username}</span>
                    <div className="date">{moment(post.post_date).fromNow()}</div>
                </div>
            </div>
          </div>
          <MoreHorizIcon  onClick={()=>setmenuOpen(!menuOpen)}/>
          {menuOpen && post.user_id == currentUser.data.user.user_id&&<button onClick={HandledeletePost}>Delete</button>}
        </div>
        <div className="content">
            <p>{post.content}</p>
            <img src={"https://res.cloudinary.com/dzhkmbnbn/image/upload/v1712615554/"+post.image_url} alt="" />
        </div>
        <div className="info">
         <div className="item">
            {isLoading ? "Isloading" : (
                (Array.isArray(data) && data.includes(currentUser?.data?.user?.user_id)) ?
                <FavoriteOutlinedIcon style={{color: "red"}} onClick={handleLiked} /> :
                <FavoriteBorderOutlinedIcon onClick={handleLiked} />
            )}
            <span>
                {isLoading ? "Loading" : (Array.isArray(data) ? data.length : 0)} Likes
            </span>
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
        {commentdisplay && <Comments postId={post.post_id}/>}
      </div>
        </div>
    );
  };
  
  export default Post;