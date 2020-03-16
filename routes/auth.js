const authRouter = require("express").Router();
const authController = require("../controllers/authController");
const User = require("../models/index").user;
const { check } = require("express-validator");
const validatorSignup = [
  check("email")
    .isEmail()
    .withMessage("Please enter a email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject("E-mail address already existis!");
        }
      });
    })
    .normalizeEmail(),
  check("password")
    .trim()
    .isLength({ min: 5 }),
  check("name")
    .trim()
    .not()
    .isEmpty()
];

authRouter.put("/signup", validatorSignup, authController.signup);
authRouter.post("/login", authController.login);

module.exports = authRouter;
