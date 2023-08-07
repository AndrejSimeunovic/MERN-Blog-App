import React, { useContext } from "react";
import { userContext } from "../context/userContext";
import ReactTimeAgo from "react-time-ago";

export default function Comment({
  username,
  createdAt,
  comment,
  commentId,
  deleteComment,
}) {
  const { userName } = useContext(userContext);

  return (
    <div className="comment">
      <div className="username">@{username}</div>
      <ReactTimeAgo
        className="date"
        date={Date.parse(createdAt)}
        locale="en-US"
      />
      <div>{comment}</div>
      {username === userName ? (
        <button
          className="delete-comment-Btn"
          onClick={() => deleteComment(commentId)}
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
