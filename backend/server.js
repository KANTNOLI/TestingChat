import express from "express";
import pgPromise from "pg-promise";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const pgp = pgPromise();

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("send", (data) => {
    console.log(data);
    socket.broadcast.emit("give", data);
  });
});

server.listen(3001, () => {
  console.log("Ready 3001");
});
