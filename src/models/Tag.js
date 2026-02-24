const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(50), allowNull: false },
    colorCode: {
      type: DataTypes.STRING(7),
      defaultValue: "#3498db",
      field: "color_code",
    },
  },
  {
    tableName: "tags",
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [{ unique: true, fields: ["user_id", "name"] }],
  },
);

module.exports = Tag;
