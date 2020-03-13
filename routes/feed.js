const feedRouter = require("express").Router();
const { check } = require("express-validator");
const feedController = require("../controllers/feedController");

const validator = [
  check("title")
    .trim()
    .isLength({ min: 5 }),
  check("content")
    .trim()
    .isLength({ min: 5 })
];
feedRouter.get("/posts", feedController.getPosts);
feedRouter.post("/posts", validator, feedController.createPosts);
feedRouter.get("/post/:postId", feedController.getPost);
feedRouter.put("/post/:postId", validator, feedController.updatePost);
feedRouter.delete("/post/:postId", feedController.deletePost);
module.exports = feedRouter;
