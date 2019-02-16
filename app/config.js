const fs = require('fs');
const path = require('path');
const sharedPath = path.join(__dirname, '../', 'test dir');
const uploadDir = sharedPath;
const port = 9818;

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
module.exports = {
    port,
    sharedPath,
    uploadDir
}