const User = require('../models/userModel');

// Importing the Utils
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// UTILS OF THIS FILE
const filterReqBody = (reqObj, ...allowedFields) => {
  const newObj = {};

  Object.keys(reqObj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = reqObj[key];
    }
  });

  return newObj;
};

//  USER ROUTE HANDLERS
exports.getAllUsers = catchAsync(async (req, res) => {
  // Explanation in tour controller file
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// This will not update the password, but will update the other user data like, email, photo, username etc
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error if the user tries to update the password here
  if (req.body.password || req.body.passwordConfirm) {
    // We don't want to update the password here, IMP! also check for the passwordConfirm property, because before saving the documents, we delete that property to be saved from the DB in the pre save hook, we will update the user document by findByIdAndUpdate, that doesn't run the pre save hooks, so password confirm will be saved to the DB
    return next(
      new AppError(
        'This route is not for password updates. Please use /users/updateMyPassword',
        400
      )
    );
  }

  // Filter the req.body because it can also contains the role,
  // The other arguments, are that which we want to keep in the obj
  const filteredBody = filterReqBody(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    // Make sure to always pass these two options
    new: true,
    runValidators: true,
  });

  // 2) Update the user document
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

// Logged in user can delete them by setting the active flag to false in the DB
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  // "204" means deleted
  res.status(204).json({
    status: 'success',
    data: null,
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
