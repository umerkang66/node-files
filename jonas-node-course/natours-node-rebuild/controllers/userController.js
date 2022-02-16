const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  // Explanation in tour controller file
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.getUser = (req, res) => {
  res.send('getting user');
};

exports.createUser = (req, res) => {
  res.send('User creating...');
};

exports.updateUser = (req, res) => {
  res.send('Updating...');
};

exports.deleteUser = (req, res) => {
  res.send('deleting...');
};
