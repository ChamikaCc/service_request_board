const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ID: ${err.value}`,
    });
  }

  // duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: `${Object.keys(err.keyValue)} already exists`,
    });
  }

  // jwt invalid
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // jwt expired
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired, please login again",
    });
  }

  // default
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;