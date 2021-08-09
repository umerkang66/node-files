// NODE MYFILE.JS

const pendingTimers = [];
const pendingOSTasks = [];
const pendingLongRunningOperations = [];

// New timers, tasks, and operations are recorded from my file running
myFile.runContent();

function shouldContinue() {
  /*
    Check One: Any pending setTimeOut, setInterval, setImmediate
    Check Two: Any pending OS tasks? (Like server listening to port)
    Check Three: Any pending long running operations (Like fs module)
  */
  return (
    pendingTimers.length ||
    pendingOSTasks.length ||
    pendingLongRunningOperations.length
  );
}

// entire body executes in 1 tick
while (shouldContinue()) {
  /*
    1) Node look at pendingTimers and sees if there are any functions that are ready to be called, then when the timers expires node calls the relevant callbacks, (setTimeOut, and setInterval)
    2) Node looks at pendingOSTasks and pendingOperations and calls relevant callbacks
    3) Pauses execution temporarily. Continue when ...
      - when a new pendingOSTasks is done
      - when a new pendingOperation is done
      - when a timer is about to complete
    4) Look at pending timers (Call any setImmediate)
    5) Handle any 'close' events
  */
}

// EXIT BACK TO TERMINAL
