// middlewares/errorMiddleware.js

export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // Check for validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors,
    });
  }

  // Handle MongoDB errors (e.g., duplicate key)
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate value error",
      errors: err.keyValue,
    });
  }

  // Generic server error
  return res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
};
