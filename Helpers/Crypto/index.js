const { runWorkerThread } = require('../worker-thread');

const encryptString = (data) =>
  runWorkerThread(`${__dirname}/crypto-worker.js`, { type: 'encrypt', data });

const decryptString = (data) =>
  runWorkerThread(`${__dirname}/crypto-worker.js`, { type: 'decrypt', data });

module.exports = { encryptString, decryptString };
