import "./Posts.scss";
import Post from "../Post/Post";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";

const Posts = () => {
  const { isLoading, error, data } = useQuery('posts', () =>
    makeRequest.get("/posts").then((res) => res.data)
  );

  return (
    <div className="Posts">
      {!data
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
            <Post post={post} key={post.id} />
          ))}
    </div>
  );
};

export default Posts;
