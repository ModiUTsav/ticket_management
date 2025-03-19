import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./route/userRoutes.js";
import ticketRoutes from "./route/ticketRoutes.js";
import commentRoutes from "./route/commentRoutes.js";
import adminRoutes from "./route/adminRoutes.js";
import agentRoutes from "./route/agentRoutes.js";
import "./ticketRebalancer.js"; // Assuming this is necessary
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server

const io = new Server(server, { // Attach Socket.IO to the HTTP server
  cors: {
    origin: "*", // Allow your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies/authentication
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const  agentSockets ={}; // Store connected agent sockets
// while(true){
  // io.emit("newAssignment","hello world")
  // }
// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("agent connected", (agentId) => {
    console.log(`Agent ${agentId} connected with socket ID: ${socket.id}`);
    agentSockets[agentId] = socket.id; // Store the agent's socket ID
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    Object.keys(agentSockets).forEach((key) => {
      if (agentSockets[key] === socket.id) {
        delete agentSockets[key]; // Remove disconnected agent
      }
    });
  });
});
// Routes
app.use("/api/user", userRoutes);
app.use("/api/tickets", ticketRoutes(io));
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agents", agentRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Use server.listen, NOT app.listen
  console.log(`Server running on port ${PORT}`);

});
// export default {socket}