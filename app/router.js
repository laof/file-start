const fs = require('fs');
const path = require('path');
const util = require('util');
const multiparty = require('multiparty');
const { sharedPath, uploadDir } = require('./config');

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
                    const litter = filedir.replace(sharedPath, '');
                    temp.push(litter);
                } else if (isDir) {
                    fileDisplay(filedir);
                }
            }
        });
    }
}

function uploadFile(req, res) {
    const opts = {
        uploadDir
    }
    const form = new multiparty.Form(opts);
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'content-type': 'text/plain' });
            res.end("invalid request: " + err.message);
            return;
        }
     
        files.upload.forEach(v => {
            let newPath = path.join(uploadDir, v.originalFilename);
            if (fs.existsSync(newPath)) {
                newPath = v.path + v.originalFilename;
            }
            fs.renameSync(v.path, newPath);
        })
        res.send({
            fields:util.inspect(fields),
            files:util.inspect(files)
        });
    });
};


let temp = [];
function list(req, res) {
    temp = [];
    fileDisplay(sharedPath);
    res.send(temp);
}


function boot(app) {
    app.post('/list', list);
    app.post('/upload', uploadFile);
}
module.exports = {
    boot
}