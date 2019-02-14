const fs = require('fs');
const path = require('path');
const sharedPath = path.join(__dirname, '../', 'test dir');
const uploadDir = path.join(sharedPath, 'upload');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
module.exports = {
    sharedPath,
    uploadDir
}