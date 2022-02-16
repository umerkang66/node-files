// BEFORE IMPLEMENTING AUTHENTICATION: It is a real responsibility to get the authentication right. Because user's data is at stake, and the company who runs the application is at stake as well

const { promisify } = require('util');
// Importing the packages
const jwt = require('jsonwebtoken');

// Importing the Models
const User = require('../models/userModel');

// Importing the Utils
// Explanation of catchAsync is in the tourController and catchAsync file
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// AUTH CONTROLLER UTILS
const jwtVerifyPromisified = promisify(jwt.verify);

const signToken = userId => {
  // FIRST ARGUMENT is payload (all the data that we want to store in the jwt i.e. userId)
  // SECOND ARGUMENT IS SECRET
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    // This jwt token will expires in the time specified (automatically logs out after certain period of time)
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

// We are not calling is createUser but signup, because that one has appropriate meaning in the context of authentication
exports.signup = catchAsync(async (req, res, next) => {
  // Get user properties from req.body
  const { name, email, password, passwordConfirm } = req.body;

  // Create new user
  const newUser = await User.create({ name, email, password, passwordConfirm });
  // If user creation failed, mongoose will automatically reject the promise, thus error will be caught in the catchAsync()

  // After signing up, log in the user
  // Usually when we signup for any web application, we also get automatically logged in (just log in no need to check for the password is correct or something like that)
  const token = signToken(newUser._id);

  // "201" means created
  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // Logging users just means to check if the password is right, if it is sign the token
  const { email, password } = req.body;

  // 1) Check if email and password actually exists
  if (!email || !password || !email.includes('@')) {
    // Create an error, and send it by either by throwing, returning next. Imp! return it
    return next(new AppError('Please provide valid email and password', 400));
  }

  // 2) Check if user exists && password is correct
  // findOne will not have the password because we have selected false in the model, but here we need it, so we explicitly have to tell the mongoose
  const user = await User.findOne({ email }).select('+password');

  // Check if the password is correct using User Model instance method, do it after !user because if user doesn't exit (null) and we access the user.correctPassword || user.password, the server will give us the error

  /* const passwordCorrect = await user.correctPassword(password, user.password); */

  // If it doesn't exist user will be "null"
  if (!user || !(await user.correctPassword(password, user.password))) {
    // We should tell the user, if the only email is correct or password is correct, tell that email or password is incorrect
    // "401" means unauthorize
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to the client
  const token = signToken(user._id);

  // 4) Send the response
  res.status(200).json({
    status: 'success',
    token,
  });
});

// This is going to be a middleware function, that will before some other route handler (then that handler will become protected)
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token from req headers and check of it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // req.headers.authorization will be 'Bearer {{token}}', we need to extract the token (remove "Bearer" string part)
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }

  // 2) Verification of token
  // If this promise rejected we have already handled that in our error controller
  const decoded = await jwtVerifyPromisified(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  // If the user is deleted by user himself or admin, then this token should not work, but currently it will work (so we have to change it)

  // We have encoded the userId as "id" in the jwt
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  // This will return true, if the user changed their password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // If user has changed his password, and someone has steel his previous password or token then after changing the password that previous token should not work, we are going to implement it on the instance method
    return next(
      new AppError('User recently changed password. Please log in again', 401)
    );
  }

  // Grant access to the next protected route handler, and put the entire user data on the req.user
  req.user = currentUser;
  next();
});

// If user is logged, further if we want to restrict the routes to the certain types of logged in users
exports.restrictTo = (...roles) => {
  // Roles is an array and it can be "admin", "controller" or "user"
  return catchAsync(async (req, res, next) => {
    // If the current user's (req.user: added by restrict middleware) role is not in the roles (that should be allowed) array, then return an error
    // Getting the currentUser's role
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return next(
        new AppError(
          "You don't have the permission to perform this action",
          401
        )
      );
    }

    // Grant access to the next route handler
    next();
  });
};
