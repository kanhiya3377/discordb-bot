const logger = require("../config/logger");
const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  // Sequelize unique constraint
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0]?.path || "field";
    return errorResponse(res, 409, `${field} already exists.`);
  }

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    return errorResponse(res, 422, "Validation error.", messages);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid token.");
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Token expired.");
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return errorResponse(res, statusCode, message);
};

const notFound = (req, res) => {
  return errorResponse(res, 404, `Route ${req.originalUrl} not found.`);
};

module.exports = { errorHandler, notFound };
