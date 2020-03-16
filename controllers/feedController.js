const { validationResult } = require("express-validator/check");
const Post = require("../models/index").post;

exports.getPosts = async (req, res, next) => {
  try {
    const { page } = req.query;
    const perPage = 5;

    const posts = await Post.findAll({
      limit: perPage,
      offset: (page - 1) * perPage
    });
    if (!posts) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ posts });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
exports.createPosts = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      creator_id: req.userId
    });
    console.log(post);
    return res.status(201).json({
      message: "Post created",
      post
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
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
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (req.userId != req.body.creator_id) {
      const error = new Error("Not authorized");
      error.statusCode = 422;
      throw error;
    }
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }

    const { postId } = req.params;
    const { title, content } = req.body;
    const post = await Post.update(
      {
        title,
        content
      },
      {
        where: {
          id: postId
        }
      }
    );
    console.log(post);
    return res.status(201).json({
      message: "Post updated",
      post
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
exports.deletePost = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (req.userId != req.body.creator_id) {
      const error = new Error("Not authorized");
      error.statusCode = 422;
      throw error;
    }
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }
    const { postId } = req.params;
    await Post.destroy({
      where: {
        id: postId
      }
    });
    return res.status(201).json({
      message: "Post deleted"
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
