const http = require('http');
const { Server } = require('socket.io');
const { PORT } = require('./config');
const app = require('../app');
const { registerRealTimeHandlers } = require("../services/realTimeService");
const server = http.createServer(app);

// CORS abierto para dev; ajustá si hace falta.
const io = new Server(server, { cors: { origin: '*' } });

// Eventos básicos (luego los movemos a services/socketService.js)
io.on('connection', (socket) => {
  registerRealTimeHandlers(io, socket);

  socket.on('disconnect', (reason) => {
    console.log(`[socket] disconnected: ${socket.id} (${reason})`);
  });
});

// Arranque
server.listen(PORT || 8080, () => {
  console.log(`[server] Listening on http://localhost:${PORT || 8080}`);
});

module.exports = { io, server };
