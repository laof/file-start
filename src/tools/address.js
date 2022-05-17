const interfaces = require('os').networkInterfaces();
const ips = [];

try {
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      const { address, family, internal } = interface;
      if (family === 'IPv4' && !internal) {
        ips.push(address);
      }
    }
  }
} catch (e) {}

module.exports = ips;
