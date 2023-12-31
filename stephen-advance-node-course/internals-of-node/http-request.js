// https and http doesn't use the thread_pool, http use the underlying operating system through libuv, neither node is making the request, nor libuv, but libuv delegate the task to operating system, where the complex network request is made. Here operating system decides how to handle the request, that's why there is no blocking inside our javascript code inside of EVENT_LOOP

// Almost all the stuff related to the networking handled by operating system, they will go to "pendingOSTasks" array in ./event-loop.js file
const https = require('https');
const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', res => {
      // Will receive the data in chunks
      res.on('data', () => {});
      res.on('end', () => {
        // All data has been received

        console.log(Date.now() - start);
      });
    })
    .end();
}

// All of these will take relatively same amount of time, this is top level code, every request will happen in its own event-loop, hence more requests doesn't have wait for the previous request to complete,
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
