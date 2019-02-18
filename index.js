#!/usr/bin/env node

const express = require('express');
const path = require('path');
const router = require('./app/router');
const {
    sharedPath,
    port
} = require('./app/config');
const {
    IPAdress
} = require('./app/address');
const app = express();
const dirname = __dirname;
const web = path.join(dirname, 'web');
router.boot(app);

app.use(express.static(web));
app.use(express.static(sharedPath));

app.listen(port, () => {
    console.log(`\n  http://localhost:${port}   \n  http://${IPAdress}:${port}`);
});