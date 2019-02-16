const fs = require('fs');
const path = require('path');
const sharedPath = path.join(process.cwd());
const port = 9818;

module.exports = {
    port,
    sharedPath
}