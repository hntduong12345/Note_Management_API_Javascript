require("dotenv").config();
const AppError = require("../utils/AppError");
const sequelize = require("../config/database");

const NoteLink = require("../models/NoteLink");
const Note = require("../models/Note");
const User = require("../models/User");

const createLinkService = async (request) => {
  const { sourceId, targetId, userId, linkContext } = request;

  const [user, sourceNote, targetNote] = await Promise.all([
    User.findByPk(userId),
    Note.findOne({ where: { id: sourceId, userId } }),
    Note.findOne({ where: { id: targetId, userId } }),
  ]);

  if (!user) throw new AppError("User is not found!", 404);
  if (!sourceNote) throw new AppError("Source note is not found", 404);
  if (!targetNote) throw new AppError("Target note is not found", 404);

  const newLink = await NoteLink.create({
    sourceNoteId: sourceId,
    targetNoteId: targetId,
    linkContext,
  });

  await newLink.reload({
    include: [
      {
        model: Note,
        as: "targetNote",
        attributes: ["title"],
      },
    ],
  });

  return mapToResponse(newLink, true);
};

const removeLinkService = async (noteLinkId, userId) => {
  const link = await NoteLink.findByPk(noteLinkId, {
    include: [{ model: Note, as: "sourceNote" }],
  });

  if (!link) throw new AppError("Note link is not found", 404);

  await link.destroy();
};

const getTargetLinksService = async (noteId, userId) => {
  const links = await NoteLink.findAll({
    where: { sourceNoteId: noteId },
    include: [
      { model: Note, as: "sourceNote", where: { userId } },
      { model: Note, as: "targetNote", attributes: ["title"] },
    ],
  });

  return links.map((link) => mapToResponse(link, true));
};

const getSourceLinksService = async (noteId, userId) => {
  const links = await NoteLink.findAll({
    where: { targetNoteId: noteId },
    include: [
      { model: Note, as: "targetNote", where: { userId } },
      { model: Note, as: "sourceNote", attributes: ["title"] },
    ],
  });

  return links.map((link) => mapToResponse(link, false));
};

const mapToResponse = (noteLink, getTarget) => {
  return {
    id: noteLink.id,
    sourceId: noteLink.sourceNoteId,
    targetId: noteLink.targetNoteId,
    linkContext: noteLink.linkContext,
    createdAt: noteLink.createdAt,
    displayTitle: getTarget
      ? noteLink.targetNote.title
      : noteLink.sourceNote.title,
  };
};

module.exports = {
  createLinkService,
  removeLinkService,
  getSourceLinksService,
  getTargetLinksService,
};
