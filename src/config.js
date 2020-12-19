const path = require('path');
const homePage = '/ui.html';
const sharedPath = path.join(process.cwd());
const IP = require('./tools/address');
const port = require('./tools/port');

module.exports = {
  homePage: homePage,
  hostUrl: `http://${IP}:${port}${homePage}`,
  port,
  IP,
  sharedPath,
};
