// Event-loop uses single thread, but some tasks are offloaded to the thread-pool, and as default behavior, thread-pool runs on 4 threads

// We can also use thread_pool for our own written functions

// Only works in linux, and unix
// This will increase the thread_size per cpu core, thus cpu core has cpu core has to do more work, (more time taken to complete the same task, if number of processing functions will increase)
// process.env.UV_THREADPOOL_SIZE = 18;

// "pbkdf2" runs in thread-pool
const { pbkdf2 } = require('crypto');

const start = Date.now();

// LIBUV LIBRARY GIVES US ACCESS TO THE UNDERLYING OPERATING SYSTEM, (WHICH INCLUDES THREAD POOL)

// All the functions are in top-level, goes to their own event-loop, then offloaded to the thread-pool (that runs on 4 threads), hence at the same time all 6 operations will be offloaded to the thread-pool, first 4 will be handled at first time, when 1 operation is finished, 5th operations is being operated, when 2nd operation is finished, then 6th operation is operated, and continues, until all the heavy operations are completed

// THE FIRST 4 WILL RUN AT SAME, TIME, AND THE LAST 2 WILL RUN ON THE ANOTHER TIME
// IF THE NODE IS SINGLE THREADED (WHICH IS NOT) ALL THESE FUNCTIONS SHOULD BE RUN AFTER ONE SHOULD BE FINISHED, BUT WE SEE 4 FUNCTIONS RUNS AT THE SAME TIME
pbkdf2('umer', 'umer', 100000, 512, 'sha512', () => {
  console.log('1: ', Date.now() - start);
});

pbkdf2('umer', 'umer', 100000, 512, 'sha512', () => {
  console.log('2: ', Date.now() - start);
});

pbkdf2('umer', 'umer', 100000, 512, 'sha512', () => {
  console.log('3: ', Date.now() - start);
});

pbkdf2('umer', 'umer', 100000, 512, 'sha512', () => {
  console.log('4: ', Date.now() - start);
});

pbkdf2('umer', 'umer', 100000, 512, 'sha512', () => {
  console.log('5: ', Date.now() - start);
});

pbkdf2('umer', 'umer', 100000, 512, 'sha512', () => {
  console.log('6: ', Date.now() - start);
});

// Cpu can process more than one thread, if my computer is dual core (when there are 2 pbkdf2), both cores were handling one, one thread (pbkdf2 function), when increased the pbkdf2 functions, now dual core has to handle 4 pbkdf2, now each core will handle two threads at a time, (by combining both, they will handle all 4 functions), but it will take more time than before, and process all the functions at the same time, thus producing the results almost at the same time, and if there are even more than 4 crypto functions, they have to wait, once one of the thread_pool_processing_function finished executing, they last functions are only 2 (each one will be handled by one core), thus this result will be much faster
