const { validationResult } = require("express-validator/check");
const Post = require("../models/index").post;
const io = require("../socket");
exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const perPage = 5;

    const posts = await Post.findAll({
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ posts });
  } catch (error) {
    return next(error);
  }
};
exports.createPosts = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }
    const { title, content } = req.body;
    const newPost = await Post.create({
      title,
      content,
      creator_id: req.userId,
    });
    let socketData = {
      action: "create",
      post: {
        ...newPost.dataValues,
        creator: { id: req.userId, name: req.name },
      },
    };
    io.getIO().emit("posts", socketData);
    return res.status(201).json({
      message: "Post created",
      post: newPost,
    });
  } catch (error) {
    return next(error);
  }
};
exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ post });
  } catch (error) {
    return next(error);
  }
};
exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (req.userId != req.body.creator_id) {
      const error = new Error("Not authorized");
      error.statusCode = 401;
      throw error;
    }
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }

    const { postId } = req.params;
    const { title, content } = req.body;
    const post = await Post.update(
      {
        title,
        content,
      },
      {
        where: {
          id: postId,
        },
      }
    );
    io.getIO().emit("posts", {
      action: "update",
      post: { ...post.dataValues, creator: { id: req.userId, name: req.name } },
    });
    return res.status(201).json({
      message: "Post updated",
    });
  } catch (error) {
    return next(error);
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    if (req.userId != req.body.creator_id) {
      const error = new Error("Not authorized");
      error.statusCode = 401;
      throw error;
    }
    const { postId } = req.params;
    await Post.destroy({
      where: {
        id: postId,
      },
    });
    io.getIO().emit("posts", {
      action: "delete",
      post: postId,
    });
    return res.status(201).json({
      message: "Post deleted",
    });
  } catch (error) {
    return next(error);
  }
};
