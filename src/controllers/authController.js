const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../config/logger");

/**
 * POST /api/v1/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check duplicate username
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return errorResponse(res, 409, "Username already taken. Please choose another.");
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return errorResponse(res, 409, "Email already registered.");
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken({ id: user.id, username: user.username, role: user.role });

    logger.info(`New user registered: ${username}`);

    return successResponse(res, 201, "Account created successfully.", {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return errorResponse(res, 401, "Invalid credentials.");
    }

    // Check account active
    if (!user.isActive) {
      return errorResponse(res, 403, "Account has been deactivated.");
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, "Invalid credentials.");
    }

    // Generate token
    const token = generateToken({ id: user.id, username: user.username, role: user.role });

    logger.info(`User logged in: ${username}`);

    return successResponse(res, 200, "Login successful.", {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 */
const getMe = async (req, res) => {
  return successResponse(res, 200, "Profile fetched.", { user: req.user });
};

module.exports = { signup, login, getMe };
