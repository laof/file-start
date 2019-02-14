const express = require('express');
const path = require('path');
const app = express();
const port = 8797;
const dirname = __dirname;
const static = path.join(dirname, 'web');
const shared = path.join(dirname, 'shared');
app.use(express.static(static));
app.listen(port, () => {
    console.log('http://localhost:' + port);
});