const notFound = (req, res, next) => {
  // Create a descriptive error object
  const error = new Error(`Not Found - ${req.originalUrl}`);

  // Set the response status to 404
  res.status(404);

  // Pass the error to the next error-handling middleware (the errorHandler)
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // standarized json message
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
