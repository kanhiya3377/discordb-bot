const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Service name cannot be empty." },
        len: { args: [2, 100], msg: "Service name must be 2–100 characters." },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "maintenance"),
      defaultValue: "active",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "services",
    timestamps: true,
    paranoid: true,
  }
);

// Associations
Service.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
User.hasMany(Service, { foreignKey: "createdBy", as: "services" });

module.exports = Service;
