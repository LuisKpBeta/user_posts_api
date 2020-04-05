const authRouter = require("express").Router();
const authController = require("../controllers/authController");
const User = require("../models/index").user;
const { check } = require("express-validator");
const validatorSignup = [
  check("email")
    .isEmail()
    .withMessage("Please enter a email")
    .custom((value, { req }) => {
      return User.findOne({ where: { email: value } }).then(userDoc => {
        if (userDoc) {
          return Promise.reject("E-mail address already existis!");
        }
      });
    })
    .normalizeEmail(),
  check("password", "Password is too short")
    .trim()
    .isLength({ min: 5 }),
  check("name", "Please enter a valid name")
    .trim()
    .not()
    .isEmpty()
];
const validatorLogin = [
  check("email")
    .isEmail()
    .withMessage("Please enter a email")
    .normalizeEmail(),
  check("password", "Password is too short")
    .trim()
    .isLength({ min: 5 })
];
authRouter.put("/signup", validatorSignup, authController.signup);
authRouter.post("/login", validatorLogin, authController.login);

module.exports = authRouter;
