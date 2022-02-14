const express = require('express');
const path = require('path');
const morgan = require('morgan');

// Importing the utils
const AppError = require('./utils/appError');
const rootDir = require('./utils/path');

// Importing the routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Importing the Controllers
const globalErrorHandler = require('./controllers/errorController');

// Creating the application
const app = express();

// MIDDLEWARES: These are the functions that can modify the request objects. Middlewares that exists firsts in the code, will be executed first
// By using the express.json() data from the request body (that comes in streams) collected and stored the req.body object
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  // Only use morgan if we are in development mode
  // Morgan is a logging middleware (that logs about requests)
  app.use(morgan('dev'));
}

// Serving static files
const staticFilesPath = path.join(rootDir, 'public');
// Fi express doesn't find any route, it will try to get that file from "public folder" because that is what we have specify in the express static middleware
app.use(express.static(staticFilesPath));

// In "use" methods we can specify any middlewares that calls next unless we send the response to client (ending the request-response cycle)
app.use((req, res, next) => {
  // Because we didn't specify an routes, this middleware will run for every request
  req.requestTime = new Date().toISOString();
  next();
});

// PLUGGING THE ROUTES IN EXPRESS
// We can also specify the routes in the use function, then callback functions will be applied to specifically to that request url
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ERROR HANDLING
// Unhandled Routes
// If router reach this part of the app.js file, it means neither of the above router have catch it, so this route doesn't exist
// "*" stands for everything
app.all('*', (req, res, next) => {
  // Create an error, then call next, that will be automatically be caught by Error Handling Middleware
  const errMessage = `Can't find ${req.originalUrl} on this server!`;
  const err = new AppError(errMessage, 404);

  // If "next" function will anything, express will assume that it is an error, then it will skip the other middlewares, and send it directly to the global error handling middleware
  next(err);
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
