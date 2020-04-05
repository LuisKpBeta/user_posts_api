const socket = require("socket.io");
let io;

exports.init = (httpServer) => {
  io = socket(httpServer);
  return io;
};
exports.getIO = () => {
  if (!io) {
    throw new Error("socket not initialized");
  }
  return io;
};
