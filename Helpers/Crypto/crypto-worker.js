const Cryptr = require('cryptr');
const { workerData, parentPort } = require('worker_threads');

const cryptr = new Cryptr(process.env.MSG_ENCRYPT_SECRET);

let processedData;
const { data, type } = workerData;

if (type === 'encrypt') processedData = cryptr.encrypt(data);
if (type === 'decrypt') processedData = cryptr.decrypt(data);

parentPort.postMessage(processedData);
