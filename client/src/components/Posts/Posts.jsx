import "./Posts.scss";
import Post from "../Post/Post";
import { useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const Posts = () => {
  const queryClient = useQueryClient();
  const {currentUser}=useContext(AuthContext) ;
  console.log(currentUser.data.user.user_id);
  const { isLoading, error, data } = useQuery('posts', async () => { 
    return  await makeRequest.get( `/Posts/getPost/${currentUser.data.user.user_id}`, {
      params: {
        userId: currentUser.data.user.user_id
      }
    })
      .then((res) => res.data);
  });
  
  console.log(data);
  return (
    <div className="Posts">
      {error ? "Something went wrong":(!data
        ? Array.from({ length: 10 }).map((_, index) => (
             <div className="ShimmerPost" key={index}>
              <div className="ShimmerAvatar"></div>
              <div className="ShimmerContent">
                <div className="ShimmerTitle"></div>
                <div className="ShimmerDescription"></div>
              </div>
            </div>
          ))
        : data.map((post) => (
            <Post post={post} key={post.post_id} />
          )))}
    </div>
  );
};

export default Posts;
