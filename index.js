#!/usr/bin/env node

const express = require('express');
const path = require('path');
const router = require('./app/router');
const socket = require('./app/socket');

const {
    sharedPath,
    port
} = require('./app/config');

const {
    IPAdress
} = require('./app/address');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const dirname = __dirname;
const web = path.join(dirname, 'web');
router.boot(app);
socket.boot(io);

app.use(express.static(web));
app.use(express.static(sharedPath));

http.listen(port, () => {
    console.log(`\n  http://localhost:${port}   \n  http://${IPAdress}:${port}`);
});