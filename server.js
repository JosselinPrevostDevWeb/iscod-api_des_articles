const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const userAuthRouter = require("./api/users/users.auth.router");
const usersController = require("./api/users/users.controller");
const articlesRouter = require('./api/articles/articles.router');
const articlesAuthRouter = require("./api/articles/articles.auth.router");
const authMiddleware = require("./middlewares/auth");
const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  /*socket.on("my_event", (data) => {
    console.log(data);
  });
  io.emit("event_from_server", { test: "foo" });*/
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

// Routes publiques
app.post("/login", usersController.login);
app.use("/api/users", userRouter);
app.use('/api/articles', articlesRouter);

// Routes protégées par le middleware d'authentification
app.use("/api/users", authMiddleware, userAuthRouter);
app.use('/api/articles', authMiddleware, articlesAuthRouter);

app.use("/", express.static("public"));


app.use((req, res, next) => {
  next(new NotFoundError());
});


app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status);
  res.json({
    status,
    message,
  });
});

module.exports = {
  app,
  server
};
