import path from 'path';
import _ips from './tools/address.js';
import _p from './tools/port.js';

export const sharedPath = path.join(process.cwd());
export const hostUrl = `http://${_ips[0]}:${_p}`;
export const IPs = _ips;
export const port = _p;
