import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateFormatter";
import "./FullPost.css";
import { userContext } from "../context/userContext";
import Comment from "../components/Comment";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

export default function FullPost() {
  const { postId } = useParams();
  const { userName } = useContext(userContext);
  const [postInfo, setPostInfo] = useState(null);
  const navigate = useNavigate();
  const commentRef = useRef();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `https://mern-blog-app-delta.vercel.app/post/${postId}`,
          { withCredentials: true }
        );
        setPostInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getPost();
  }, []);

  async function postComment(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://mern-blog-app-delta.vercel.app/post/comment",
        {
          comment: commentRef.current.value,
          postId,
        },
        { withCredentials: true }
      );
      commentRef.current.value = "";
      setPostInfo(response.data);
    } catch (error) {
      if (error.response.status === 403) {
        toast.info("Please login to be able to leave a comment!");
      }
      commentRef.current.value = "";
    }
  }

  async function deleteComment(commentId) {
    try {
      const response = await axios.delete(
        `https://mern-blog-app-delta.vercel.app/post/comment/${commentId}/${postId}`,
        {
          withCredentials: true,
        }
      );
      setPostInfo(response.data);
    } catch (error) {}
  }
  return (
    <>
      {postInfo ? (
        <>
          <div className="full-post-title">{postInfo.title}</div>
          <div className="date">{formatDate(postInfo.createdAt)}</div>
          <div className="username">by @{postInfo.author.username}</div>
          {postInfo.author.username === userName ? (
            <button
              className="edit-btn"
              onClick={() => navigate(`/edit-post/${postId}`)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit this post
            </button>
          ) : null}
          <img
            className="fullpost-img"
            src={`https://mern-blog-app-delta.vercel.app/${postInfo.image}`}
            alt="post"
          />
          <div
            style={{ lineHeight: "1.6rem" }}
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          />

          <div className="comment-container">
            {postInfo.comments.length > 0 ? (
              <>
                {" "}
                <div className="comment-title">Comments</div>
                {postInfo.comments.map((comment) => {
                  return (
                    <Comment
                      key={comment._id}
                      commentId={comment._id}
                      username={comment.username}
                      createdAt={comment.createdAt}
                      comment={comment.comment}
                      deleteComment={deleteComment}
                    />
                  );
                })}
              </>
            ) : null}

            <form onSubmit={postComment} className="comment-form-container">
              <div className="comment-title">Leave a comment</div>
              <textarea
                ref={commentRef}
                placeholder={
                  postInfo.comments.length > 0
                    ? "Leave a comment..."
                    : "Be the first to leave a comment..."
                }
                rows={5}
              />
              <button className="post-comment-btn" type="submit">
                Post comment
              </button>
            </form>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
