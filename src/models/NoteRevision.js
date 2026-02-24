const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NoteRevision = sequelize.define(
  "NoteRevision",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contentSnapshot: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: "content_snapshot",
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "version_number",
    },
  },
  {
    tableName: "note_revisions",
    timestamp: true,
    updatedAt: false,
    underscored: true,
  },
);

module.exports = NoteRevision;
