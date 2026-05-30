const { Service, User } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");

/**
 * POST /api/v1/services
 */
const createService = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const service = await Service.create({
      name,
      description,
      status: status || "active",
      createdBy: req.user.id,
    });

    return successResponse(res, 201, "Service created.", { service });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/services
 */
const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      include: [{ model: User, as: "creator", attributes: ["id", "username"] }],
      order: [["createdAt", "DESC"]],
    });
    return successResponse(res, 200, "Services fetched.", { services, count: services.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/services/:id
 */
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{ model: User, as: "creator", attributes: ["id", "username"] }],
    });

    if (!service) return errorResponse(res, 404, "Service not found.");

    return successResponse(res, 200, "Service fetched.", { service });
  } catch (err) {
    next(err);
  }
};

module.exports = { createService, getAllServices, getServiceById };
