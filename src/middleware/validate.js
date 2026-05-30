const { body, validationResult } = require("express-validator");
const { errorResponse } = require("../utils/response");

// Middleware to check validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 422, "Validation failed.", errors.array());
  }
  next();
};

const signupValidation = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required.")
    .isLength({ min: 3, max: 50 }).withMessage("Username must be 3–50 characters.")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, underscores."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Must be a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number."),

  handleValidation,
];

const loginValidation = [
  body("username").trim().notEmpty().withMessage("Username is required."),
  body("password").notEmpty().withMessage("Password is required."),
  handleValidation,
];

module.exports = { signupValidation, loginValidation };
