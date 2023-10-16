require("dotenv").config;

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const socket = require("socket.io");

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.static("public"));

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));

server = app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});

// Socket setup
const io = socket(server);
const activeUsers = new Set();
io.on("connection", function (socket) {
    console.log("Made socket connection");
  
    socket.on("new user", function (data) {
      socket.userId = data;
      activeUsers.add(data);
      io.emit("new user", [...activeUsers]);
    });
  
    socket.on("disconnect", function () {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
      });
  
      socket.on("chat message", function (data) {
        io.emit("chat message", data);
    });
  
  });