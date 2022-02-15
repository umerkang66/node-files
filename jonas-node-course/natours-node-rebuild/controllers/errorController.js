const AppError = require('../utils/appError');

// HANDLING ERRORS THAT ARE NOT "!isOperational" FOR PRODUCTION (ADD "isOperational")
const handleCastErrorsDB = err => {
  // These are happens when there is "invalid Id"
  const message = `Invalid ${err.path}: ${err.value}`;

  // By creating instance of AppError we automatically add isOperational property to the error object
  // "400" means bad request
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorsDB = err => {
  // These are happens when there is "duplicate Field" is field should be unique
  const message = `Duplicate field value: "${err.keyValue.name}". Please use another one`;

  // Adding isOperational, and "400" means bad request
  return new AppError(message, 400);
};

const handleValidationErrorsDB = err => {
  // Handling mongoose validation errors

  // Here mongoose already create the meaningful message property for us, that also contains if the multiple validation errors happened, i.e. err.message (this is currently we are not using)

  // Creating our own string (but mongoose string can also be used)
  // This err object that we got from express, is send by our responses, and it is wrapped the real error is actually errors object inside of err object

  const errors = Object.values(err.errors).map(curErr => curErr.message);
  const errStr = `Invalid input data, ${errors.join('. ')}`;

  // "400" means bad request
  // return new AppError(err.message, 400);
  return new AppError(errStr, 400);
};

// SENDING ERRORS IN DEVELOPMENT AND PRODUCTION
const sendErrorDev = (err, res) => {
  // In the development send as much information as possible

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // In production, only send status, and message, and errors that are only operational, not programming error
    // Operational errors are trusted errors, so we can send them to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // This is for programming error, and we don't want to leak the error detail, these can also be synchronous code errors IMP! in asynchronous code (that are not handled by global UNCAUGHT EXCEPTIONS)

    // If this weird error occurs, we, developers have to know what kind of error happened, so LOG it to the console
    console.error('PROGRAMMING ERROR FROM PROD 💥💥💥', err);

    // here send only some generic message,
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

// If there are 4 arguments, express will automatically recognize it as error handling middleware, where first argument will be actual error object
const errorController = (err, req, res, next) => {
  // If statusCode is not defined it is "500" (internal server error)
  err.statusCode = err.statusCode || 500;
  // If status is not defined it is "error" (internal server error)
  err.status = err.status || 'error';

  // Send different errors in development and production environments
  if (process.env.NODE_ENV === 'development') {
    // Development error should have everything in their response

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // There are 3 types of errors that might be created by mongoose, and they !isOperational property, so we have to manually mark them as isOperational = true in production (in development we don't care)

    // Create an hard copy of original obj
    // There are 2 tricks we can copy an object
    // 1) First Trick
    let error = { ...err };

    // For some reason "copied error" does not have name property so use "err" object instead, so manually add it
    error.name = err.name;
    // Sometimes it also happens with message
    error.message = err.message;

    // 2) Second Trick
    // let error = JSON.parse(JSON.stringify(err));

    if (error.name === 'CastError') {
      // "CastError" is happens by mongoose when there is "Invalid Id"
      error = handleCastErrorsDB(error);
    }

    // We can use both
    // if (error.code === 11000) {
    if (error.name === 'MongoServerError') {
      // "MongoServerError" happens when mongodb driver (!mongoose) same name (if name property should be unique) error occurs
      error = handleDuplicateFieldsErrorsDB(error);
    }

    if (error.name === 'ValidationError') {
      // Mongoose validation errors will be handled here
      error = handleValidationErrorsDB(error);
    }

    sendErrorProd(error, res);
  }
};

// This is going to plugged in express application in app.js file
module.exports = errorController;
