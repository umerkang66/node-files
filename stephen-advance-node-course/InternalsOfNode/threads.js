const crypto = require('crypto');

const start = Date.now();

// Asynchronous function
// this particular function will move to the thread pool
// There are four threads in single thread
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  const timeTaken = Date.now() - start;
  console.log('1:', timeTaken);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  const timeTaken = Date.now() - start;
  console.log('2:', timeTaken);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  const timeTaken = Date.now() - start;
  console.log('3:', timeTaken);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  const timeTaken = Date.now() - start;
  console.log('4:', timeTaken);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  const timeTaken = Date.now() - start;
  console.log('5:', timeTaken);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  const timeTaken = Date.now() - start;
  console.log('6:', timeTaken);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  const timeTaken = Date.now() - start;
  console.log('7:', timeTaken);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  const timeTaken = Date.now() - start;
  console.log('8:', timeTaken);
});
