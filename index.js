#!/usr/bin/env node

const express = require("express");
const path = require("path");
const router = require("./app/router");
const socket = require("./app/socket");

const { sharedPath, host, port } = require("./app/config");

const app = express();

// app.all("*", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", " 3.2.1");
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });

const http = require("http").Server(app);
const io = require("socket.io")(http);

const dirname = __dirname;
const web = path.join(dirname, "web");
router.boot(app);
socket.boot(io);

app.use(express.static(web));
app.use(express.static(sharedPath));

http.listen(port, () => {
  console.log(`http://localhost:${port}   \n` + host);
});
