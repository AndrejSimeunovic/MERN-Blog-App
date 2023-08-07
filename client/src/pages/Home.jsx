import { useEffect, useState } from "react";
import "../App.css";
import Post from "../components/Post";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts", {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllPosts();
  }, []);
  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            key={post._id}
            id={post._id}
            author={post.author.username}
            title={post.title}
            image={post.image}
            createdAt={post.createdAt}
            excerpt={post.excerpt}
          />
        );
      })}
    </>
  );
}

export default Home;
