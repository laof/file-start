const express = require('express');
const path = require('path');
const router = require('./app/router');
const { sharedPath } = require('./app/config');
const app = express();
const port = 8797;
const dirname = __dirname;
const static = path.join(dirname, 'web');
const shared = path.join(dirname, 'shared');

router.boot(app);
app.use(express.static(static));
app.use(express.static(sharedPath));
app.listen(port, () => {
    console.log('http://localhost:' + port);
});