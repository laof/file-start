const path = require('path');
const sharedPath = path.join(process.cwd());
const IPs = require('./tools/address');
const port = require('./tools/port');

module.exports = {
  port,
  IPs,
  hostUrl: `http://${IPs[0]}:${port}`,
  sharedPath,
};
