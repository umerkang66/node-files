const mongoose = require('mongoose');
const User = mongoose.model('User');

const userFactory = () => {
  // No need to put the data about user
  return new User({}).save();
};

module.exports = userFactory;
