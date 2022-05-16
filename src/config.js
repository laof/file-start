const path = require('path');
const sharedPath = path.join(process.cwd());
const IP = require('./tools/address');
const port = require('./tools/port');

module.exports = {
  hostUrl: `http://${IP}:${port}`,
  port,
  IP,
  sharedPath,
};
