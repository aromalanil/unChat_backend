const { Worker } = require('worker_threads');

const runWorkerThread = (workerUrl, workerData) =>
  new Promise((resolve, reject) => {
    const worker = new Worker(workerUrl, { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Stopped the Worker Thread with the exit code: ${code}`));
    });
  });

module.exports = { runWorkerThread };
