export const errorResponseHandler = (req, res, next, err) => {
  const statusCode = err.statusCode || 5000;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export const invalidPathHandler = (req, res, next) => {
  const error = new Error("Invalid path!");
  error.statusCode = 404;
  next(error);
};
