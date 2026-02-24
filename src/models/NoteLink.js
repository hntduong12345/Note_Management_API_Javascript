const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NoteLink = sequelize.define(
  "NoteLink",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    linkContext: { type: DataTypes.TEXT, field: "link_context" },
  },
  {
    tableName: "note_links",
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

module.exports = NoteLink;
