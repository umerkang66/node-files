const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

setTimeout(() => console.log('TIMER 1 FINISHED'), 0);
setImmediate(() => console.log('IMMEDIATE 1 FINISHED'));

fs.readFile('./test-file.txt', 'utf-8', () => {
  console.log('I/O FINISHED');
  console.log('--------------');

  setTimeout(() => console.log('TIMER 2 FINISHED'), 0);
  setTimeout(() => console.log('TIMER 3 FINISHED'), 3000);
  setImmediate(() => console.log('IMMEDIATE 2 FINISHED'));

  process.nextTick(() => console.log('PROCESS.NEXTTICK'));

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'PASSWORD ENCRYPTED');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'PASSWORD ENCRYPTED');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'PASSWORD ENCRYPTED');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'PASSWORD ENCRYPTED');
  });
});

console.log('HELLO FROM THE TOP LEVEL CODE');
