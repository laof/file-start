const dirTree = require('directory-tree');
const path = require('path');
const { sharedPath } = require('../config');
const replacePath = sharedPath.split(path.sep).join('/');

function list(req, res) {
  let success = false;
  const map = dirTree(
    sharedPath,
    {
      /** split flag: '\' */
      normalizePath: true,
    },
    (item, PATH, stats) => {
      item.download = item.path.replace(replacePath, '');
    }
  );
  if (map.path) {
    success = true;
  }
  map.success = success;
  res.send(map);
}

module.exports = list;
