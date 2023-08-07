import React, { useEffect, useRef, useState } from "react";
import "./CreatePost.css";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

export default function EditPost() {
  const titleRef = useRef();
  const imageRef = useRef();
  const excerptRef = useRef();
  const contentRef = useRef();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postInfo, setPostInfo] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/post/${postId}`,
          { withCredentials: true }
        );
        setPostInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getPost();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/post",
        {
          title: titleRef.current.value,
          image: imageRef.current.files[0],
          excerpt: excerptRef.current.value,
          content: contentRef.current.value,
          postId,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPostInfo(response.data);
      navigate(-1);
      toast.success("Post updated!");
    } catch (error) {
      toast.error("Fill in all fields!");
    }
  }

  async function deletePost() {
    const response = confirm("Are you sure you want to delete this post?");
    if (response) {
      try {
        const res = await axios.delete(`http://localhost:3000/post/${postId}`, {
          withCredentials: true,
        });
        toast.success("Post deleted");
        navigate("/");
      } catch (error) {}
    }
  }
  return (
    <>
      <div className="full-post-title">Edit post</div>
      {postInfo ? (
        <>
          <form
            onSubmit={handleSubmit}
            className="create-post-container"
            encType="multipart/form-data"
          >
            <input
              ref={titleRef}
              defaultValue={postInfo.title}
              name="title"
              type="text"
              placeholder="Enter a title"
            />
            <input ref={imageRef} type="file" name="image" accept="image/*" />
            <textarea
              ref={excerptRef}
              defaultValue={postInfo.excerpt}
              name="excerpt"
              className="excerpt"
              placeholder="Enter a excerpt"
              maxLength={200}
            />
            <div>
              <ReactQuill
                ref={contentRef}
                defaultValue={postInfo.content}
                name="content"
              />
            </div>

            <button style={{ marginBottom: "20px" }} type="submit">
              Update post
            </button>
          </form>
          <button className="deleteBtn" type="submit" onClick={deletePost}>
            Delete post
          </button>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
