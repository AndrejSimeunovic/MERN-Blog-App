import React, { useRef } from "react";
import "./CreatePost.css";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreatePost() {
  const titleRef = useRef();
  const imageRef = useRef();
  const excerptRef = useRef();
  const contentRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/create-post",
        {
          title: titleRef.current.value,
          image: imageRef.current.files[0],
          excerpt: excerptRef.current.value,
          content: contentRef.current.value,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
      toast.error("Fill in all fields and choose a image!");
    }
  }
  return (
    <>
      <div className="full-post-title">Create Post</div>
      <form
        onSubmit={handleSubmit}
        className="create-post-container"
        encType="multipart/form-data"
      >
        <input
          ref={titleRef}
          name="title"
          type="text"
          placeholder="Enter a title"
        />
        <input ref={imageRef} type="file" name="image" accept="image/*" />
        <textarea
          ref={excerptRef}
          name="excerpt"
          className="excerpt"
          placeholder="Enter a excerpt"
        />
        <div className="quill">
          <ReactQuill className="quill" ref={contentRef} name="content" />
        </div>

        <button className="create-btn" type="submit">
          Create post
        </button>
      </form>
    </>
  );
}
