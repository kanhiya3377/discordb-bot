const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        name: "unique_username",
        msg: "Username already exists.",
      },
      validate: {
        len: { args: [3, 50], msg: "Username must be 3–50 characters." },
        notEmpty: { msg: "Username cannot be empty." },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: "unique_email",
        msg: "Email already registered.",
      },
      validate: {
        isEmail: { msg: "Must be a valid email address." },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true, // soft delete (deletedAt)
  }
);

module.exports = User;
