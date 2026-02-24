const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    iconIdentifier: { type: DataTypes.STRING(50), field: "icon_identifier" },
  },
  {
    tableName: "categories",
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

module.exports = Category;
