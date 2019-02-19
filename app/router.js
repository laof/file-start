const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const dirTree = require('directory-tree');
const {
    sharedPath
} = require('./config');

function getNewPate(pathstr, fileName) {
    let exists = true;
    let index = 0;
    const {
        dir,
        ext
    } = path.parse(pathstr);
    while (exists) {
        if (fs.existsSync(pathstr)) {
            const newBase = fileName + (++index) + ext;
            pathstr = path.format({
                dir,
                base: newBase
            })
        } else {
            exists = false;
        }
    }
    return pathstr;
}

function uploadFile(req, res) {

    let success = false;

    const opts = {
        uploadDir: sharedPath
    }
    const form = new multiparty.Form(opts);

    form.parse(req, (err, fields, files) => {

        const dir = fields.dir[0];
        if (err || !dir) {
            res.send({
                err,
                success
            });
            return;
        }
        try {
            files.upload.forEach(v => {
                const pathstr = path.format({
                    dir,
                    base: v.originalFilename // 带后缀 'name.txt'
                })
                const newPath = getNewPate(pathstr, path.parse(pathstr).name);
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
    form.on('error', (err) => {
        res.send({
            err,
            success
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