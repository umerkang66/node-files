const crypto = require('crypto');
const https = require('https');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', res => {
      res.on('data', () => {});
      res.on('end', () => {
        const timeTaken = Date.now() - start;
        console.log('HTTPS: ', timeTaken);
      });
    })
    .end();
}

function doHash() {
  // Asynchronous function
  // this particular function will move to the thread pool
  // There are four threads in single thread
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    const timeTaken = Date.now() - start;
    console.log('HASH:', timeTaken);
  });
}

doRequest();

fs.readFile('multitask.js', 'utf-8', () => {
  const timeTaken = Date.now() - start;
  console.log('FS: ', timeTaken);
});

doHash();
doHash();
doHash();
doHash();
