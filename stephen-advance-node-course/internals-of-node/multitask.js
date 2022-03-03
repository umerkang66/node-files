const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', res => {
      // Will receive the data in chunks
      res.on('data', () => {});
      res.on('end', () => {
        // All data has been received

        console.log('REQUEST: ', Date.now() - start);
      });
    })
    .end();
}

function doHash() {
  crypto.pbkdf2('umer', 'umer', 100000, 512, 'sha512', () => {
    console.log('HASH: ', Date.now() - start);
  });
}

// This doesn't use the thread_pool, so appears first
doRequest();

fs.readFile('multitask.js', 'utf8', () => {
  console.log('FS: ', Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();

// OUTPUT
/* 
  REQUEST:  881
  HASH:  1249
  FS:  1252
  HASH:  1252
  HASH:  1261
  HASH:  1336 
*/

// EXPLANATION
/* 
  1) HTTP request always comes first because, that is not handled by thread_pool, that is handled by operating system (doesn't block the js code in event-loop)

  2) Why fs (reading the file) takes so much time? When fs.readFile task comes to the (one of the thread of) thread_pool, there is a little pause (node first gets the statistics of the file, like how big the file is, and something like that, then it will fetch the file) when reading the file from the HardDrive (because of that pause), thread_pool decides to just temporarily thrown that task (fs.readFile) away for future, and continues the other tasks, (here they are doHash() function), put the doHash in the thread where the fs.readFile operation was 

  3) Now all the threads of thread_pool has doHash(), these will be calculated, after one thread is empty (1 doHash function is processed) that fs.readFile will be calculated.

  4) That's why fs.readFile takes the same amount of time as the 4 doHash() function does

  5) Without doHash() fs.readFile takes only about 30 - 40 milliseconds
*/
