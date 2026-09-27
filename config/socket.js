import { Server } from "socket.io";

let io;

// Called once, when the server starts — wraps your existing HTTP server
// with Socket.io's real-time layer

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    } //  allow React frontend to connect
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });


  return io;
};

// Lets other files (like orderController.js) access the same io instance
// without creating a circular import back to server.js.
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
};