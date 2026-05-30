const sequelize = require("../config/database");
const User = require("./User");
const Service = require("./Service");

module.exports = { sequelize, User, Service };
