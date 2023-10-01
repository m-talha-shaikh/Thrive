import "./Posts.scss"
import Post from "../Post/Post";

const Posts = ()=>
{
  const posts = [
    {
      id: 123,
      name: "Arham Ahmed",
      userId: 90,
      profilePic:
        "https://res.cloudinary.com/dzhkmbnbn/image/upload/v1696183974/arham_c4mnx8.jpg",
      desc: "check out this",
      img: "https://res.cloudinary.com/dzhkmbnbn/image/upload/v1696183974/arham_c4mnx8.jpg",
    },
    {
      id: 34,
      name: "Yousuf Ahmed",
      userId: 23,
      profilePic:
        "https://res.cloudinary.com/dzhkmbnbn/image/upload/v1696183974/arham_c4mnx8.jpg",
      desc: "This is me",
      img: "https://res.cloudinary.com/dzhkmbnbn/image/upload/v1696183975/yousuf_mosgs4.jpg"
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