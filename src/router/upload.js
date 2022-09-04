import fs from 'fs';
import path from 'path';
import multiparty from 'multiparty';
import { sharedPath } from '../config.js';

function getNewPate(pathstr, fileName) {
  let exists = true;
  let index = 0;
  const { dir, ext } = path.parse(pathstr);
  while (exists) {
    if (fs.existsSync(pathstr)) {
      const newBase = fileName + ++index + ext;
      pathstr = path.format({
        dir,
        base: newBase,
      });
    } else {
      exists = false;
    }
  }
  return pathstr;
}

function upload(req, res) {
  let success = false;

  const opts = {
    uploadDir: sharedPath,
  };
  const form = new multiparty.Form(opts);

  form.parse(req, (err, fields, files) => {
    try {
      const dir = fields.dir[0];
      if (err || !dir) {
        res.send({
          err,
          success,
        });
        return;
      }

      files.upload.forEach((v) => {
        const pathstr = path.format({
          dir,
          base: v.originalFilename, // 带后缀 'name.txt'
        });
        const newPath = getNewPate(pathstr, path.parse(pathstr).name);
        fs.renameSync(v.path, newPath);
      });
      success = true;
    } catch (e) {
      success = false;
    }

    if (success) {
      res.send({
        success,
        fields,
        files,
      });
    }
  });

  form.on('error', (err) => {
    res.send({
      err,
      success,
    });
  });
}

export default upload;
