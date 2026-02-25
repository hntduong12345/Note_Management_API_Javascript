require("dotenv").config();
const AppError = require("../utils/AppError");

const NoteRevision = require("../models/NoteRevision");
const Note = require("../models/Note");
const User = require("../models/User");
const Tag = require("../models/Tag");

const createRevisionService = async (noteId, userId, request) => {
  const { contentBody, versionNumber } = request;

  const note = await Note.findOne({
    where: { id: noteId, userId },
  });
  if (!note) throw new AppError("Note is not found", 404);

  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User is not found", 404);

  await NoteRevision.create({
    noteId,
    contentSnapshot: contentBody,
    versionNumber,
  });
};

const getRevisionHistoryService = async (noteId, userId) => {
  const note = await Note.findOne({
    where: { id: noteId, userId },
  });
  if (!note) throw new AppError("Note is not found", 404);

  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User is not found", 404);

  return await NoteRevision.findAll({
    where: { noteId },
    attributes: ["id", "versionNumber", "createdAt"],
    order: [["versionNumber", "DESC"]],
  });
};

const getRevisionDetailService = async (revisionId, userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User is not found", 404);

  const revision = await NoteRevision.findByPk(revisionId, {
    include: [
      {
        model: Note,
        where: { userId },
        attributes: [],
      },
    ],
  });
  if (!revision) throw new AppError("Note Revision is not found", 404);

  return {
    id: revision.id,
    versionNumber: revision.versionNumber,
    contentSnapshot: revision.contentSnapshot,
    createdAt: revision.createdAt,
  };
};

const restoreRevisionService = async (revisionId, userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User is not found", 404);

  const revision = await NoteRevision.findByPk(revisionId, {
    include: [
      {
        model: Note,
        where: { userId },
        include: [Tag],
      },
    ],
  });
  if (!revision) throw new AppError("Note Revision is not found", 404);

  const note = revision.Note;

  //Update note content with the past version snapshot
  note.contentBody = revision.contentSnapshot;
  await note.save();

  //Sync data
  await note.reload();

  return {
    id: note.id,
    title: note.title,
    content: note.contentBody,
    categoryId: note.categoryId,
    tags: note.Tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      colorCode: tag.colorCode,
    })),
    updatedAt: note.updatedAt,
  };
};

module.exports = {
  createRevisionService,
  getRevisionDetailService,
  getRevisionHistoryService,
  restoreRevisionService,
};
