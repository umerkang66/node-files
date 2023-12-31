// ALL OF THIS IS FAKE CODE
/* Event Loop is single-threaded, but more complicated tasks are sent off to the thread-pool, which currently uses 4 threads (that we can change). Every Asynchronous operation in top-level code creates its own callback queue, and then its callbacks will runs in the event-loop (event-loops starts after the top-level code is executed), but asynchronous operations that are inside of the event-loop, then they run in order, that is explained further in this file */

// CALLBACK QUEUES: These array are created when node.js starts the program, by detecting these three types of callbacks (there is also close callbacks)
const pendingTimers = [];
// Like http server: offloaded tasks to the OS
const pendingOSTasks = [];
// Like functions from fs, crypto
const pendingOperations = [];

// Start the node process: node myFile.js
// 1) At first all the top-level code is executed (so top level code doesn't have to be asynchronous, it can be synchronous usually), but it can also be asynchronous, that just put its callbacks in the callback queue
myFile.runToplevelContent();

// 2) Enters the node.js event-loop (pretending the event-loop as while loop)
// Every loop of the while-loop is called "tick"

/**
 * Return true or false, if the while loop (event-loop) should continue or not
 * @implements Node js checks for 3 separate checks if the event-loop should continue or not
 * @returns boolean
 */
function shouldContinue() {
  // Check one: Any pending setTimeout, setInterval, setImmediate
  // Check two: Any pending operating system tasks, (http server)
  // Check three: Any pending long running operations (functions in fs module)

  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
}

while (shouldContinue()) {
  // 1) Node looks at pendingTimers, and sees if any callbacks are ready to be called. setTimeout, setInterval
  // 2) Node looks at pending OS tasks, and sees if any callbacks are ready to be called
  // 3) Pause executions temporarily. Continuing when...
  //    - a new pendingOSTask is done
  //    - a new pendingOperation is done
  //    - a timer is about to complete
  // 4) Look at pendingTimers. Call any setImmediate
  // 5) Handle any close events, close events can be emitted from something like "readStream"
}

// Exit back to terminal
process.exit(0);
