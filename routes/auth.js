const authRouter = require("express").Router();
const authController = require("../controllers/authController");
const User = require("../models/index").user;
const { check } = require("express-validator");
const validator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a email")
    .custom((value, { req }) => {
      return User.findOne({ email: value });
    })
];

authRouter.put("/signup", authController.signup);

module.exports = authRouter;
