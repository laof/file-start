const router = require('express').Router();
const { hostUrl } = require('../config');
const { getSocketHistory } = require('../socket');
const dirList = require('./dir-list');
const upload = require('./upload');

router.post('/list', dirList);

router.post('/upload', upload);

router.post('/host', (req, res) => {
  res.send({ host: hostUrl });
});

router.post('/download', (req, res, next) => {
  const obj = req.query;
  try {
    res.download(obj.file, obj.fileName);
  } catch (e) {
    res.stats(400).send('download error');
  }
});

router.post('/talk_history', (req, res) => {
  res.send({
    list: getSocketHistory(),
    success: true,
  });
});

module.exports = router;
