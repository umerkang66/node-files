const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

// These logs will not be in order, because these all will run in its own callback queue, because Timers, setImmediate, and I/O tasks have their own event-loop phases and callbacks
setTimeout(() => console.log('Timer 1 finished'), 0);

setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.txt', (err, data) => {
  // The Problem begins if the callback of other phases are to run in the callback of one event-loop phase, like here the callbacks of timer and setImmediate are running in the callback of I/O operation that is reading the file
  console.log('I/O finished');

  // EXPLANATION: first setImmediate callback will run because that comes after the I/O callbacks, then close callbacks, then the loop starts again, then it will run the timer 2, and in the end timer 3

  setTimeout(() => console.log('Timer 2 finished'), 0);

  setTimeout(() => console.log('Timer 3 finished'), 3000);

  setImmediate(() => console.log('Immediate 2 finished'));

  // This will happen in the next tick after the I/O operation is done (nextTick is a misleading name, because tick is a entire loop but nextTick runs after every event-loop phase)
  process.nextTick(() => console.log('Process.nextTick()'));

  // crypto tasks will send off to thread pool (and there are 4 threads in the thread pool), so if we use 4 crypto operations, they all will happen in the same time, but if we add from 5 to 8, they will take the double amount of time
  // Because on the 5th crypto operation, all the threads in the thread pool will be filled, and the 5th one will only run after one of the thread in the thread pool will be free
  // If these were synchronous functions that will block the main thread of node js, so the the processes of event-loop will run after this synchronous tasks (like Timers, setImmediate, and nextTick function)
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'password encrypted');
  });
});

console.log('Hello from the top level code');
