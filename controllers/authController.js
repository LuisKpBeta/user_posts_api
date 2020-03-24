const User = require("../models/index").user;
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, name, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    await User.create({ email, password: hashPassword, name });
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body.email;
  try {
    let user = await User.findOne({
      raw: true,
      where: {
        email
      }
    });
    if (!user) {
      const error = new Error("A user with this email could not be found");
      error.statusCode = 401;
      throw error;
    }
    const isEquals = await bcrypt.compare(password, user.password);
    if (!isEquals) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }
    const token = await jwt.sign(
      { name: user.name, email: user.email, id: user.id },
      "myprivatekey",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
