// When we will start our application with cluster mode, index.js file will run first time, where "isMaster" property will be true, this will also create the "clusterManager", clusterManager can other instances of our application, (runs again index.js) where isMaster property will be false, this multiple instances of our application (index.js) will be handling multiple http request at the same time

// When we create cluster, every instance have their own thread_pool
process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');

// This is only for windows
// cluster.schedulingPolicy = cluster.SCHED_RR;

// CURRENTLY THIS IS WORKING ON LINUX, NOT WINDOWS
// Is the file being executed in master mode
if (cluster.isMaster) {
  // Cause index.js to be executed *again* but in slave mode
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // Iam a child iam going to act like a server, and do nothing else
  const crypto = require('crypto');
  const express = require('express');
  const app = express();

  // "http" requests are also asynchronous
  app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
      res.send('<h1>Hi There</h1>');
    });
  });

  app.get('/fast', (req, res) => {
    res.send('<h1>This was fast</h1>');
  });

  app.listen(3000, () => {
    console.log('App is listening on port 3000');
  });
}
