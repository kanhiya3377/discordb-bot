const { verifyToken } = require("../utils/jwt");
const { User } = require("../models");
const { errorResponse } = require("../utils/response");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user || !user.isActive) {
      return errorResponse(res, 401, "Invalid token or account deactivated.");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Token expired. Please login again.");
    }
    return errorResponse(res, 401, "Invalid token.");
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return errorResponse(res, 403, "Access denied. Admins only.");
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
