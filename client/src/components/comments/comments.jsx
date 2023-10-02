import { AuthContext } from "../../context/AuthContext";
import { useState,useContext } from "react";
import "./comments.scss"
const comments = ()=>
{
    const {currentUser}= useContext(AuthContext);
    const comments = [
        {
          id: 1,
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
          name: "John Doe",
          userId: 1,
          profilePicture:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          id: 2,
          desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
          name: "Jane Doe",
          userId: 2,
          profilePicture:
            "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
        },
      ];
   return(
    <div className="comments">
        <div className="write">
            <img src={currentUser.Profile} alt="" />
            
            <input type="text" placeholder="Write a Comment"/>
            <button>Send</button>
            
            
        </div>
       {comments.map(comment =>(
        <div className="comment">
           <img src={comment.profilePicture} alt="" />
        <div className="message">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
        </div>
        <span className="date">1 Hour ago</span>
        </div>
        
       ))}
    </div>
   )
}
export default comments;