const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Note = sequelize.define(
  "Note",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    contentBody: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: "content_body",
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_archived",
    },
  },
  { tableName: "notes", timestamp: true, underscored: true },
);

module.exports = Note;
