import { AuthContext } from "../../context/AuthContext";
import { useState,useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import "./comments.scss"
import moment from "moment";
const comments = ({postId})=>
{
  
    const {currentUser}= useContext(AuthContext);
    const { isLoading, error, data } = useQuery('comments', async () => {
      return  await makeRequest.get("/Comments?postId="+postId)
        .then((res) => res.data);
    });
   console.log(data);
   return(
    <div className="comments">
        <div className="write">
            <img src={currentUser.data.user.ProfilePic} alt="" />
            
            <input type="text" placeholder="Write a Comment"/>
            <button>Send</button>
            
            
        </div>
       {isLoading ? "Loading" : data.map(comment =>(
        <div className="comment">
           <img src={comment.profilePicture} alt="" />
        <div className="message">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
        </div>
        <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
        
       ))}
    </div>
   )
}
export default comments;