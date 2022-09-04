import { Router } from 'express';
import { hostUrl } from '../config.js';
import { getSocketHistory } from '../socket.js';
import dirList from './dir-list.js';
import upload from './upload.js';
import { exec } from 'child_process';
import { platform } from 'os';

const p = platform();

const router = Router();

router.post('/list', dirList);

router.post('/upload', upload);

router.post('/host', (req, res) => {
  res.send({ host: hostUrl, shutdown: p === 'win32' });
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

router.post('/shutdown', (req, res) => {
  setTimeout(() => exec('shutdown -s'), 0);

  res.send({});
});

export default router;
