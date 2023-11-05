const socketIO = require('socket.io');

let io;

module.exports = {
  init: (server, options) => {
    io = socketIO(server, options);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
