const express = require("express");
const cors = require("cors");
const db_connect = require("./utils/db");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "./uploads" });
const fs = require("fs");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 5000;

const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

const salt = bcrypt.genSaltSync(10);

const app = express();
db_connect();

app.use(
  cors({
    credentials: true,
    origin: "https://mern-blog-app-frontend-jet.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(200).json("ok");
  } catch (error) {
    if (!password || !username) {
      res.status(400).json({ message: "Please fill in the empty field(s)!" });
    } else if (User.find({ username })) {
      res.status(400).json({ message: "Username already exists!" });
    } else {
      res.status(500).json(error.message);
    }
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, user.password);
    if (passOk) {
      //success
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
      res.cookie("token", accessToken).json("ok");
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).json("wrong credentials");
  }
});

app.get("/login", authenticateToken, (req, res) => {
  res.status(200).json("ok");
});
app.get("/register", authenticateToken, (req, res) => {
  res.status(200).json("ok");
});

app.get("/profile", authenticateToken, async (req, res) => {
  res.json(req.user);
});

app.post("/profile", authenticateToken, async (req, res) => {
  res.json(req.user);
});

app.get("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post(
  "/create-post",
  upload.single("image"),
  authenticateToken,
  async (req, res) => {
    let newPath = null;
    const { title, excerpt, content } = req.body;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    } else {
      return res.status(500).json("no image found");
    }

    const { user } = req.user;

    try {
      const post = await Post.create({
        title,
        image: newPath,
        excerpt,
        content,
        author: user._id,
      });
      res.status(200).json("ok");
    } catch (error) {
      res.status(400).json("All fields are required!");
    }
  }
);

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("author", ["username"])
      .populate("comments");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put(
  "/post",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    let newPath = null;
    const { user } = req.user;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }
    const { title, excerpt, content, postId } = req.body;

    const postDoc = await Post.findById(postId);

    const updates = {
      title,
      image: newPath ? newPath : postDoc.image,
      excerpt,
      content,
    };

    const isAuthor =
      JSON.stringify(user._id) === JSON.stringify(postDoc.author);

    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    try {
      const post = await Post.findByIdAndUpdate(postId, updates, {
        runValidators: true,
      });
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json("all fields required!");
    }
  }
);

app.delete("/post/:postId", authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const { user } = req.user;
  const postDoc = await Post.findById(postId);

  const isAuthor = JSON.stringify(user._id) === JSON.stringify(postDoc.author);

  if (!isAuthor) {
    return res.status(400).json("you are not the author");
  }

  try {
    await Post.findByIdAndDelete(postId);
    fs.unlink(postDoc.image, (err) => {
      if (err) throw err;
    });
    res.status(200).json("ok");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/post/comment", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { comment, postId } = req.body;
  try {
    const commentDoc = await Comment.create({
      username: user.username,
      comment,
      post: postId,
    });
    const update = { $push: { comments: commentDoc._id } };
    await Post.findByIdAndUpdate(postId, update);
    const post = await Post.findById(postId)
      .populate("comments")
      .populate("author", ["username"]);
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Fill in the required field!" });
  }
});

app.delete(
  "/post/comment/:commentId/:postId",
  authenticateToken,
  async (req, res) => {
    const { commentId, postId } = req.params;
    const { user } = req.user;
    const commentDoc = await Comment.findById(commentId);

    const isAuthor = user.username === commentDoc.username;

    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    try {
      await Comment.findByIdAndDelete(commentId);
      const update = { $pull: { comments: commentId } };
      await Post.findByIdAndUpdate(postId, update);
      const post = await Post.findById(postId)
        .populate("comments")
        .populate("author", ["username"]);
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

function authenticateToken(req, res, next) {
  const { token } = req.cookies;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
