import React from "react";
import { formatDate } from "../utils/dateFormatter";
import { useNavigate } from "react-router-dom";

export default function Post({ author, title, excerpt, image, createdAt, id }) {
  const navigate = useNavigate();

  return (
    <div className="post-container">
      <div className="post-img-container">
        <img
          className="post-img"
          src={`https://mern-blog-app-delta.vercel.app/${image}`}
          alt="post"
          onClick={() => navigate(`/post/${id}`)}
        />
      </div>
      <div className="post-info-container">
        <div className="title" onClick={() => navigate(`/post/${id}`)}>
          {title}
        </div>
        <div className="user-date-container">
          <div className="username">{author}</div>
          <div className="date">{formatDate(createdAt)}</div>
        </div>
        <div className="excerpt">{excerpt}</div>
      </div>
    </div>
  );
}
