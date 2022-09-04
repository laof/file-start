import dirTree from 'directory-tree';
import path from 'path';
import { sharedPath } from '../config.js';
const replacePath = sharedPath.split(path.sep).join('/');

export default function (req, res) {
  let success = false;
  const map = dirTree(
    sharedPath,
    {
      attributes: ['size', 'type', 'extension'],
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
