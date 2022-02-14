module.exports = (err, req, res, next) => {
  // If there are 4 arguments, express will automatically recognize it as error handling middleware, where first argument will be actual error object
  // If statusCode is not defined it is "500" (internal server error)
  err.statusCode = err.statusCode || 500;
  // If status is not defined it is "error" (internal server error)
  err.status = err.status || 'error';

  // Sending response to client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
