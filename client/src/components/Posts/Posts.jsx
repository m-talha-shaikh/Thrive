import "./Posts.scss"
import Post from "../Post/Post";

const Posts = ()=>
{
  const posts = [
    {
      id: 123,
      name: "Talha Shekh",
      userId: 90,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "check out this",
      img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 34,
      name: "Yousuf Ahmed",
      userId: 23,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "This is me",
      img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
    },
  ];
  return(
    <div className="Posts">
        {posts.map(post=>(
          <Post post={post} key={post.id}/>
        ))}
    </div>
  )
}
export default Posts;