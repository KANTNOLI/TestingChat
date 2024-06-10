import express from "express";
import pg from "pg-promise";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import os from "os";

const localIP = Object.values(os.networkInterfaces())
  .flat()
  .find((iface) => iface.family === "IPv4" && !iface.internal)?.address;

const app = express();
const dbApp = express();

const socketPort = process.env.PORT || 3001;
const dbPort = process.env.PORT || 5001;
const bd = pg()({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "5432",
  port: 5432,
});

app.use(cors());
const server = http.createServer(app);

//Работа с сокетами
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socket.on("join", (props) => {
    socket.join(props.room);
    io.to(props.room).emit("send", `Join ${props.name}`);
    console.log(props.room + " " + props.name);
  });

  socket.on("send", (data) => {
    socket.to(data.room).emit("give", JSON.parse(data.data));
    console.log(data.room + " mess " + data.data);
  });
});
server.listen(socketPort, () => {
  console.log(`Сервер запущен! Путь ${localIP}:${socketPort}`);
});
//Работа с сокетами


//Работа с Базой данных
dbApp.listen(dbPort, async () => {
  console.log(`Сервер запущен! Путь ${localIP}:${dbPort}`);
});

dbApp.get("/api1", (req, res) => {
  bd.query("SELECT * FROM users")
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
});

dbApp.get("/api2", (req, res) => {
  bd.query("SELECT * FROM messages")
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
});
//Работа с Базой данных
