const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authorization.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, "myprivatekey");
  } catch (error) {
    error = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.id;
  next();
};
