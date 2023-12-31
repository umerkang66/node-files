// Because of cached module
console.log('It will only run one time');

// This will run multiple times, because explicitly call this function after requiring it
module.exports = () => console.log('This will run multiple time 😀😀😀');
