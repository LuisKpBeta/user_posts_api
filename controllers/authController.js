const User = require("../models/index").user;
exports.signup = (req, res, next) => {
  const { email, name, password } = req.body;
};
