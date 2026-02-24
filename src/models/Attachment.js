const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attachment = sequelize.define(
  "Attachment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fileUrl: {
      type: DataTypes.STRING(512),
      allowNull: false,
      field: "file_url",
    },
    fileType: { type: DataTypes.STRING(100), field: "file_type" },
    fileSizeBytes: { type: DataTypes.BIGINT, field: "file_size_bytes" },
    externalId: { type: DataTypes.STRING(255), field: "external_id" },
  },
  {
    tableName: "attachments",
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

module.exports = Attachment;
