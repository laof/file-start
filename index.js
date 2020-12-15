/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 182:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const path = __webpack_require__(622);
const homPage = '/ui.html';
const sharedPath = path.join(process.cwd());
const IP = __webpack_require__(499);
const port = __webpack_require__(475);

module.exports = {
  homPage: homPage,
  hostUrl: `http://${IP}:${port}${homPage}`,
  port,
  IP,
  sharedPath,
};


/***/ }),

/***/ 295:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const dirTree = __webpack_require__(597);
const path = __webpack_require__(622);
const { sharedPath } = __webpack_require__(182);
const replacePath = sharedPath.split(path.sep).join('/');

function list(req, res) {
  let success = false;
  const map = dirTree(
    sharedPath,
    {
      /** split flag: '\' */
      normalizePath: true,
    },
    (item, PATH, stats) => {
      item.download = item.path.replace(replacePath, '');
    }
  );
  if (map.path) {
    success = true;
  }
  map.success = success;
  res.send(map);
}

module.exports = list;


/***/ }),

/***/ 413:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const router = __webpack_require__(127).Router();
const { hostUrl } = __webpack_require__(182);
const { getSocketHistory } = __webpack_require__(798);
const dirList = __webpack_require__(295);
const upload = __webpack_require__(117);

router.post('/list', dirList);

router.post('/upload', upload);

router.post('/host', (req, res) => {
  res.send({ host: hostUrl });
});

router.post('/download', (req, res, next) => {
  const obj = req.query;
  try {
    res.download(obj.file, obj.fileName);
  } catch (e) {
    res.stats(400).send('download error');
  }
});

router.post('/talk_history', (req, res) => {
  res.send({
    list: getSocketHistory(),
    success: true,
  });
});

module.exports = router;


/***/ }),

/***/ 117:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(747);
const path = __webpack_require__(622);
const multiparty = __webpack_require__(758);
const { sharedPath } = __webpack_require__(182);

function getNewPate(pathstr, fileName) {
  let exists = true;
  let index = 0;
  const { dir, ext } = path.parse(pathstr);
  while (exists) {
    if (fs.existsSync(pathstr)) {
      const newBase = fileName + ++index + ext;
      pathstr = path.format({
        dir,
        base: newBase,
      });
    } else {
      exists = false;
    }
  }
  return pathstr;
}

function upload(req, res) {
  let success = false;

  const opts = {
    uploadDir: sharedPath,
  };
  const form = new multiparty.Form(opts);

  form.parse(req, (err, fields, files) => {
    try {
      const dir = fields.dir[0];
      if (err || !dir) {
        res.send({
          err,
          success,
        });
        return;
      }

      files.upload.forEach((v) => {
        const pathstr = path.format({
          dir,
          base: v.originalFilename, // 带后缀 'name.txt'
        });
        const newPath = getNewPate(pathstr, path.parse(pathstr).name);
        fs.renameSync(v.path, newPath);
      });
      success = true;
    } catch (e) {
      success = false;
    }

    if (success) {
      res.send({
        success,
        fields,
        files,
      });
    }
  });

  form.on('error', (err) => {
    res.send({
      err,
      success,
    });
  });
}

module.exports = upload;


/***/ }),

/***/ 798:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const onlineUsers = {}; //统计客户端登录用户
const talkList = [];
let onlineUserCount = 0; //客户端连接数量

function getTime() {
  return new Date().getTime();
}

function callback(socket) {
  socket.emit('open'); //通知客户端已连接

  //构造客户端对象
  var client = {
    socket: socket,
    name: false,
  };

  //监听客户端的chat message事件， 该事件由客户端触发
  //当服务端收到消息后，再把该消息播放出去，继续触发chat message事件， 然后在客户端监听chat message事件。
  socket.on('chat message', function (msg) {
    var obj = {
      time: getTime(),
    }; //构建客户端返回的对象

    //判断是不是第一次连接，以第一条消息作为昵称
    if (!client.name) {
      onlineUserCount++;

      client.name = msg;
      obj['text'] = client.name;
      obj['author'] = 'Sys';
      obj['type'] = 'welcome';
      obj['onlineUserCount'] = onlineUserCount;
      socket.name = client.name; //用户登录后设置socket.name， 当退出时用该标识删除该在线用户
      if (!onlineUsers.hasOwnProperty(client.name)) {
        onlineUsers[client.name] = client.name;
      }
      obj['onlineUsers'] = onlineUsers; //当前在线用户集合
      // console.log(client.name + ' login,当前在线人数:' + onlineUserCount);

      //返回欢迎语
      socket.emit('system', obj); //发送给自己的消息
      //广播新用户已登录
      socket.broadcast.emit('system', obj); //向其他用户发送消息
    } else {
      //如果不是第一次聊天，则返回正常的聊天消息
      obj['text'] = msg;
      obj['author'] = client.name;
      obj['type'] = 'message';
      // console.log(client.name + ' say:' + msg);

      socket.emit('chat message', obj); //发送给自己的消息 ， 如果不想打印自己发送的消息，则注释掉该句。
      socket.broadcast.emit('chat message', obj); //向其他用户发送消息

      talkList.push(obj);
    }

    //io.emit('chat message',msg);
  });

  socket.on('disconnect', function () {
    onlineUserCount--;

    if (onlineUsers.hasOwnProperty(socket.name)) {
      delete onlineUsers[client.name];
    }

    var obj = {
      time: getTime(),
      author: 'Sys',
      text: client.name,
      type: 'disconnect',
      onlineUserCount: onlineUserCount,
      onlineUsers: onlineUsers,
    };

    //广播用户退出
    socket.broadcast.emit('system', obj); //用户登录和退出都使用system事件播报
    // console.log(client.name + ' disconnect,当前在线人数:' + onlineUserCount);
  });
}

function listen(server) {
  const io = __webpack_require__(395)(server);
  io.on('connection', (socket) => callback(socket));
}

function getSocketHistory() {
  return talkList;
}

module.exports = {
  socket: {
    listen,
  },
  getSocketHistory,
};


/***/ }),

/***/ 499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const interfaces = __webpack_require__(87).networkInterfaces();

const getNetworkAddress = () => {
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      const { address, family, internal } = interface;
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
};

module.exports = getNetworkAddress();


/***/ }),

/***/ 475:
/***/ ((module) => {

const MaxPort = 65535;
const MinPort = 20;
const argv = process.argv.reverse();

let port = 5200;

if (argv.length <= 3) {
  for (let i = 0; i < argv.length; i++) {
    const n = Number(argv[i]);
    if (n && n > MinPort && n < MaxPort) {
      port = n;
      break;
    }
  }
}

module.exports = port;


/***/ }),

/***/ 597:
/***/ ((module) => {

"use strict";
module.exports = require("directory-tree");;

/***/ }),

/***/ 127:
/***/ ((module) => {

"use strict";
module.exports = require("express");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 758:
/***/ ((module) => {

"use strict";
module.exports = require("multiparty");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 395:
/***/ ((module) => {

"use strict";
module.exports = require("socket.io");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
// #!/usr/bin/env node

const express = __webpack_require__(127);
const path = __webpack_require__(622);
const { socket } = __webpack_require__(798);
const { sharedPath, hostUrl, port, homPage } = __webpack_require__(182);
const app = express();
const http = __webpack_require__(605).Server(app);
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

app.use('/api', __webpack_require__(413));

app.use(express.static(web));
app.use(express.static(sharedPath));

http.listen(port, () => {
  console.log(`http://localhost:${port}${homPage}   \n` + hostUrl);
});

})();

/******/ })()
;