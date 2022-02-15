// Importing the Models
const User = require('../models/userModel');

// Importing the Utils
// Explanation of catchAsync is in the tourController and catchAsync file
const catchAsync = require('../utils/catchAsync');

// We are not calling is createUser but signup, because that one has appropriate meaning in the context of authentication
exports.signup = catchAsync(async (req, res, next) => {
  // Get user properties from req.body
  const { name, email, password, passwordConfirm } = req.body;

  // Create new user
  const newUser = await User.create({ name, email, password, passwordConfirm });

  // "201" means created
  res.status(201).json({
    status: 'success',
    data: { user: newUser },
  });
});
