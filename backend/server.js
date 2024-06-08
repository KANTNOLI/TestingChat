import express from "express";
import pg from "pg-promise";
import { Server as HttpServer } from "http";
import { Server as SocketIoServer } from "socket.io";

const api = {
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "5432",
  port: 5432,
};

const app = express();
const port = process.env.PORT || 5001;
const bd = pg()(api);

const server = new HttpServer(app);
server.listen(port, () => {
  test();
  console.log(`Сервер удачно запущен на порту ${port}`);
});

async function test() {
  let a = await bd.query("SELECT * FROM users");
  console.log(a);
}

// Инициализация Socket.IO и привязка к HTTP серверу
const io = new SocketIoServer(server, {
  cors: {
    origin: "*", // Разрешаем любые источники для демонстрационных целей
  },
});

// Обработчик для событий подключения клиентов
io.on("connection", (socket) => {
  console.log("Новый пользователь подключился");

  // Обработка сообщений от клиента
  socket.on("chat message", (msg) => {
    console.log("Сообщение от клиента:", msg);
    // Рассылаем сообщение всем подключенным клиентам
    io.emit("chat message", msg);
  });

  // Обработка отключения клиента
  socket.on("disconnect", () => {
    console.log("Пользователь отключился");
  });
});

// app.get("/api1", async (req, res) => {
//   try {
//     const data = await bd.query(
//       "SELECT * FROM shop INNER JOIN users ON users.id = shop.id"
//     );
//     res.status(200).json(data);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Ошибка при выполнении запроса к базе данных" });
//   }
// });
