const feedRouter = require("express").Router();
const { check } = require("express-validator");
const feedController = require("../controllers/feedController");
const isAuth = require("../middleware/is-auth");
const validator = [
  check("title", "Invalid Title").trim().isLength({ min: 5 }),
  check("content", "Invalid text for content").trim().isLength({ min: 5 }),
];
feedRouter.get("/posts", isAuth, feedController.getPosts);
feedRouter.post("/posts", isAuth, validator, feedController.createPosts);
feedRouter.get("/post/:postId", isAuth, feedController.getPost);
feedRouter.put("/post/:postId", isAuth, validator, feedController.updatePost);
feedRouter.delete("/post/:postId", isAuth, feedController.deletePost);
module.exports = feedRouter;
