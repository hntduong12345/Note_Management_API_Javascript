const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const NoteRevision = require("./NoteRevision");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    mfaSecret: { type: DataTypes.STRING, field: "mfa_secret" }, //Currently not using in the app
  },
  { tableName: "users", timestamp: true, updatedAt: false },
);

module.exports = User;
