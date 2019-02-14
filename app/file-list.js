const fs = require('fs');
const path = require('path');


function fileDisplay(filePath) {
    const files = fs.readdirSync(filePath);
    if (Array.isArray(files)) {
        files.forEach((filename) => {
            const filedir = path.join(filePath, filename);
            const stats = fs.statSync(filedir);
            if (stats) {
                const isFile = stats.isFile();
                const isDir = stats.isDirectory();
                if (isFile) {
                    console.log(filedir);
                } else if (isDir) {
                    fileDisplay(filedir);
                }
            }
        });
    }
}

let list = [];
export function getList() {
    list = [];
    const filePath = path.resolve('E:');
    fileDisplay(filePath);
}