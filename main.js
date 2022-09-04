
import express from 'express';
import { resolve, join } from 'path';
import { Server } from 'http';
import router from './src/router/index.js';
import { listen } from './src/socket.js';
import { sharedPath, IPs, port } from './src/config.js';

const app = express();
const http = Server(app);

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

const web = join(resolve(), 'web');

listen(http);

app.use('/api', router);

app.use(express.static(web));
app.use(express.static(sharedPath));


http.listen(port, () => {
  console.log('http://localhost:' + port);
  IPs.forEach((ip)=>{
    console.log(`http://${ip}:${port}`)
  })
});
