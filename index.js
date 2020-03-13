const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const feedRouter = require("./routes/feed");
const authRouter = require("./routes/auth");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/feed", feedRouter);
app.use("/auth", authRouter);
app.use((error, req, res, next) => {
  console.log("at middleware" + error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});
app.listen(3000);
