import { AuthContext } from "../../context/AuthContext";
import { useState,useContext } from "react";
import { useQuery, useQueryClient,useMutation } from "react-query";
import { makeRequest } from "../../axios";
import "./comments.scss"
import moment from "moment";

const comments = ({postId})=>
{
    const [content,setcontent]= useState("");
    const {currentUser}= useContext(AuthContext);
    const { isLoading, error, data } = useQuery('comments', async () => {
      return  await makeRequest.get("/Comments?postId="+postId)
        .then((res) => res.data);
    });
    const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newComemnt) => {
      try {
        const response = await makeRequest.post("/Comments", newComemnt);
        return response.data; // Assuming your response contains the new post data
      } catch (err) {
        throw err; 
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ content,postId ,user_id:currentUser.data.user.user_id  });
    setcontent("");
  };

   return(
    <div className="comments">
        <div className="write">
            <img src={currentUser.data.user.ProfilePic} alt="" />
            <input type="text" placeholder="Write a Comment" 
            onChange={(e)=> setcontent(e.target.value)}
            value={content}/>
            <button onClick={handleClick}>Send</button>
            
            
        </div>
       {isLoading ? "Loading" : data.map(comment =>(
        <div className="comment">
           <img src={comment.ProfilePic} alt="" />
        <div className="message">
            <span>{comment.name}</span>
            <p>{comment.content}</p>
        </div>
        <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
        
       ))}
    </div>
   )
}
export default comments;