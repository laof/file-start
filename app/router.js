const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const dirTree = require('directory-tree');
const {
    sharedPath
} = require('./config');

function uploadFile(req, res) {
    
    const form = new multiparty.Form(opts);

    form.parse(req, (err, fields, files) => {
        let success = false;
        if (err) {
            res.send({
                success
            });
            return;
        }
        try {
            const dir = fields.dir[0];
            const pathArry = dir.split('/');
            files.upload.forEach(v => {
                let newPath = path.join(...pathArry, v.originalFilename);
                if (fs.existsSync(newPath)) {
                    newPath = v.path + v.originalFilename;
                }
                fs.renameSync(v.path, newPath);
            })
            success = true;
        } catch (e) {}

        res.send({
            success,
            fields,
            files
        });
    });
};

const replacePath = sharedPath.split(path.sep).join('/');

function list(req, res) {
    const map = dirTree(sharedPath, {
        /** split flag: '\' */
        normalizePath: true
    }, (item, PATH, stats) => {
        item.download = item.path.replace(replacePath, '');
    })
    res.send(map);
}


function boot(app) {
    app.post('/list', list);
    app.post('/upload', uploadFile);
}
module.exports = {
    boot
}