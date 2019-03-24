const fs = require('fs');
const path = require('path');
const sharedPath = path.join(process.cwd());
const MaxPort = 65535;
const MinPort = 20;
let port = 5200;

const {
    IPAdress
} = require('./address');

/**
 * 2019/02/19 j-z
 */

const argv = process.argv.reverse();

if (argv.length <= 3) {
    for (let i = 0; i < argv.length; i++) {
        const n = Number(argv[i]);
        if (n && n > MinPort && n < MaxPort) {
            port = n;
            break;
        }
    }
}


module.exports = {
    host: 'http://' + IPAdress + ':' + port,
    port,
    IP: IPAdress,
    sharedPath
}