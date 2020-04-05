const socket = require("./socket");
const app = require("./app");
const server = app.listen(3000);
io = socket.init(server);
io.on("connection", socket => {
  console.log("connection");
});
