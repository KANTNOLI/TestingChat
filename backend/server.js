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

const socketPort = process.env.PORT_SOCKET || 3001;
const dbPort = process.env.PORT_DB || 5001;
const bd = pg()({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "5432",
  port: 5432,
});

app.use(cors());
dbApp.use(cors());
const server = http.createServer(app);

//Работа с сокетами
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data);
  });

  socket.on("send", (data) => {
    const rand = Math.random() * (100000 - 0) + 0;

    bd.query(
      `insert into messages values (${rand}, ${data.chatid}, ${data.senderid}, '${data.content}')`
    );
    socket.to(data.room).emit("give", {name: data.room, id: data.chatid});
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

dbApp.get("/users", (req, res) => {
  const userName = req.query.name ? req.query.name : "";

  bd.query(
    `
    SELECT users.id, users.name, users.userName, chat_participants.chatid, chat_participants, chats.name FROM users
    JOIN chat_participants ON users.id = chat_participants.userId
    JOIN chats ON chat_participants.chatId = chats.id
    WHERE users.userName = '@${userName}'`
  )
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
});

dbApp.get("/messages", (req, res) => {
  const id = req.query.id ? req.query.id : 0;

  bd.query(
    `select * from messages
     where chatid = ${id}`
  )
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
});
//Работа с Базой данных
