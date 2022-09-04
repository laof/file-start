import { networkInterfaces } from 'os';
const interfaces = networkInterfaces();
const ips = [];

try {
  for (const name of Object.keys(interfaces)) {
    for (const intf of interfaces[name]) {
      const { address, family, internal } = intf;
      if (family === 'IPv4' && !internal) {
        ips.push(address);
      }
    }
  }
} catch (e) {}

export default ips;
