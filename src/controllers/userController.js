const { User } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");

/**
 * GET /api/v1/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    return successResponse(res, 200, "Users fetched.", { users, count: users.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return errorResponse(res, 404, "User not found.");

    return successResponse(res, 200, "User fetched.", { user });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/users/username/:username
 */
const getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: { exclude: ["password"] },
    });

    if (!user) return errorResponse(res, 404, "User not found.");

    return successResponse(res, 200, "User fetched.", { user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, getUserByUsername };
