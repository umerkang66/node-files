// NODE MYFILE.JS

const pendingTimers = [];
const pendingOSTasks = [];
const pendingLongRunningOperations = [];

// New timers, tasks, and operations are recorded from my file running
myFile.runContent();

function shouldContinue() {
  // Check One: Any pending setTimeOut, setInterval, setImmediate
  // Check Two: Any pending OS tasks? (Like server listening to port)
  // Check Three: Any pending long running operations (Like fs module)
  return (
    pendingTimers.length ||
    pendingOSTasks.length ||
    pendingLongRunningOperations.length
  );
}

// entire body executes in 1 tick
while (shouldContinue()) {}

// EXIT BACK TO TERMINAL
