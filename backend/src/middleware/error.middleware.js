// backend/src/middleware/error.middleware.js
// A simple global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred on the server.";
  res.status(statusCode).json({ message });
};

export default errorHandler;
