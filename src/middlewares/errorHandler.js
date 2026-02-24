const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = error.message;

  //Function handle Specific Error
  const handleSequenlizeUniqueError = (err) => {
    const message = `Duplicated field value: ${err.errors[0].value}. Please use another value!`;
    return new AppError(message, 400);
  };

  const handleSequelizeValidationError = (err) => {
    const message = err.errors.map((el) => el.message).join(". ");
    return new AppError(`Invalid input data: ${message}`, 400);
  };

  // Handle specific Error
  // Handle Sequelize Unique Contraints
  if (err.name === "SequelizeUniqueConstraintError")
    error = handleSequenlizeUniqueError(err);

  // Handle Sequelize Validation
  if (err.name === "SequelizeValidationError")
    error = handleSequelizeValidationError(err);

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError")
    error = new AppError("Invalid token. Please log in again", 401);

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    // Include stack trace only in DEV Mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
