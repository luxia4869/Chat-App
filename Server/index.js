const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const app = express();
const socket = require("socket.io");
// import { writeFile } from "fs";
const writeFile = require("fs");

require("dotenv").config();
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log(data.type)
    const sendUserSocket = onlineUsers.get(data.to);
    if (data.type === "txt") {
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg, data.filename, data.extension, data.byteFile);
      }
    }
    else {
      console.log('filemsg')
      socket.to(sendUserSocket).emit("msg-recieve", data.msg, data.filename, data.extension, data.byteFile);
    }
  });

  // socket.on("upload", (file, callback) => {
  //   console.log(file); // <Buffer 25 50 44 ...>

  //   // save the content to the disk, for example
  //   writeFile.writeFile("/public/upload", file, (err) => {
  //     callback({ message: err ? "failure" : "success" });
  //   });
  // });

});
