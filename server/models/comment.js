const { default: mongoose } = require("mongoose");

const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
    username: { type: String },
    comment: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
