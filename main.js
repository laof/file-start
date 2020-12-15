// #!/usr/bin/env node

const express = require('express');
const path = require('path');
const { socket } = require('./src/socket');
const { sharedPath, hostUrl, port, homPage } = require('./src/config');
const app = express();
const http = require('http').Server(app);
// const token = 'a'+(new Date().getTime().toString())
// app.all("*", (req, res, next) => {
//   const m = req.method.toLocaleLowerCase();
//   const post = m === "post";
//   if (post) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", "3.2.1");
//     res.header("Access-Control-Allow-Headers", "*");
//     res.header("Content-Type", "application/json;charset=utf-8");
//   }
//   next();
// });

const web = path.join(__dirname, 'web');

socket.listen(http);

app.use('/api', require('./src/router'));

app.use(express.static(web));
app.use(express.static(sharedPath));

http.listen(port, () => {
  console.log(`http://localhost:${port}${homPage}   \n` + hostUrl);
});
