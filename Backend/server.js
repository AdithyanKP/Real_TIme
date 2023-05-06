const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const messages = [];

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Send all previous messages to the new user
  socket.emit("message history", messages);

  socket.on("message", (message) => {
    // console.log(`User ${socket.id} sent message: ${message}`);
    const newMessage = { id: socket.id, message: message };
    messages.push(newMessage);
    // Broadcast the message to all connected clients (excluding sender)
    socket.broadcast.emit("message", newMessage);
  });

  // socket.on("disconnect", () => {
  //   console.log(`User ${socket.id} disconnected`);
  // });
});
server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
