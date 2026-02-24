const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// Import entity models definitions
const User = require("./User");
const Category = require("./Category");
const Note = require("./Note");
const Tag = require("./Tag");
const NoteRevision = require("./NoteRevision");
const NoteLink = require("./NoteLink");
const Attachment = require("./Attachment");

// --- RELATIONSHIPS (Associations) ---
// 1. User
User.hasMany(Note, { foreignKey: "user_id", onDelete: "CASCADE" });
Note.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Category, { foreignKey: "user_id", onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Tag, { foreignKey: "user_id", onDelete: "CASCADE" });
Tag.belongsTo(User, { foreignKey: "user_id" });

// 2. Category
Category.hasMany(Note, { foreignKey: "category_id", onDelete: "SET NULL" });
Note.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// 3. Note
Note.belongsToMany(Tag, {
  through: "note_tags",
  foreignKey: "note_id",
  otherKey: "tag_id",
  timestamps: false,
});
Tag.belongsToMany(Note, {
  through: "note_tags",
  foreignKey: "tag_id",
  otherKey: "note_id",
  timestamps: false,
});

Note.hasMany(NoteRevision, { foreignKey: "note_id", onDelete: "CASCADE" });
NoteRevision.belongsTo(Note, { foreignKey: "note_id" });

Note.hasMany(Attachment, { foreignKey: "note_id", onDelete: "CASCADE" });
Attachment.belongsTo(Note, { foreignKey: "note_id" });

Note.hasMany(NoteLink, { foreignKey: "source_note_id", as: "outgoingLinks" });
NoteLink.belongsTo(Note, { foreignKey: "source_note_id", as: "source" });

Note.hasMany(NoteLink, { foreignKey: "target_note_id", as: "backlinks" });
NoteLink.belongsTo(Note, { foreignKey: "target_note_id", as: "target" });

module.exports = {
  sequelize,
  User,
  Category,
  Note,
  Tag,
  NoteRevision,
  NoteLink,
  Attachment,
};
