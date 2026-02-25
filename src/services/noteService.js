require("dotenv").config();
const AppError = require("../utils/AppError");
const Operator = require("sequelize");

const Note = require("../models/Note");
const Tag = require("../models/Tag");
const Category = require("../models/Category");
const User = require("../models/User");
const sequelize = require("../models");

const searchNotesService = async (searchTerm, userId, limit, offset) => {
  const { count, rows } = await Note.findAndCountAll({
    where: {
      userId,
      isArchived: false,
      [Operator.or]: [
        { title: { [Operator.iLike]: `%${searchTerm}%` } },
        {
          contentBody: { [Operator.cast]: "text" },
          [Operator.iLike]: `%${searchTerm}%`,
        },
      ],
    },
    include: [{ model: Tag }, { model: Category }],
    limit,
    offset,
    order: [["updatedAt", "DESC"]],
  });

  return {
    totalElements: count,
    data: rows.map((note) => mapToResponse(note)),
  };
};

const getNoteDetailService = async (id) => {
  const note = await Note.findOne({
    where: { id, isArchived: false },
    include: [{ model: Tag }, { model: Category }],
  });

  if (!note) throw new AppError("Note is not found", 404);
  return mapToResponse(note);
};

const createNoteService = async (request, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction: transaction });
    if (!user) throw new AppError("User is not found", 404);

    const newNote = await Note.create(
      {
        title: request.title,
        contentBody: request.contentBody,
        userId: userId,
        categoryId: request.categoryId || null,
        isArchived: false,
      },
      { transaction: transaction },
    );

    //Sync tags
    if (request.tagRequest && request.tagRequest.length > 0) {
      const tags = await syncTags(request.tagRequest, userId, transaction);
      await newNote.setTags(tags, { transaction: transaction });
    }

    await transaction.commit();
    await newNote.reload({ include: [Tag, Category] });
    return mapToResponse(newNote);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateNoteService = async (id, request, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction: transaction });
    if (!user) throw new AppError("User is not found", 404);

    const note = await Note.findOne({
      where: { id },
      include: [Tag],
      transaction: transaction,
    });
    if (!note) throw new AppError("Note is not found", 404);

    if (
      request.lastSyncAt &&
      new Date(note.updatedAt) > new Date(request.lastSyncAt)
    ) {
      throw new AppError(
        "This note was updated on other device, please reload the note",
        409,
      );
    }

    note.title = request.title;
    note.contentBody = request.contentBody;
    note.categoryId = request.categoryId || null;

    if (request.tagRequest) {
      const tags = await syncTags(request.tagRequest, userId, transaction);
      await note.setTags(tags, { transaction: transaction });
    }

    await note.save({ transaction: transaction });
    await transaction.commit();

    await note.reload({ include: [Tag, Category] });
    return mapToResponse(note);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const softDeleteService = async (id) => {
  const note = await Note.findByPk(id);
  if (!note) throw new AppError("Note is not found", 404);

  note.isArchived = true;
  await note.save();
};

const syncTags = async (tagRequests, userId, transaction) => {
  const tagInstances = [];
  for (const req of tagRequests) {
    const [tag] = await Tag.findOrCreate({
      where: { name: req.name, userId },
      defaults: { colorCode: req.color, userId },
      transaction,
    });

    if (tag.colorCode !== req.color) {
      tag.colorCode = req.color;
      await tag.save({ transaction });
    }
    tagInstances.push(tag);
  }
  return tagInstances;
};

const mapToResponse = (note) => {
  return {
    id: note.id,
    title: note.title,
    contentBody: note.contentBody,
    categoryId: note.Category ? note.Category.id : note.categoryId || null,
    tags: note.Tags
      ? note.Tags.map((t) => ({
          id: t.id,
          name: t.name,
          colorCode: t.colorCode,
        }))
      : [],
    updatedAt: note.updatedAt,
  };
};

module.exports = {
  searchNotesService,
  getNoteDetailService,
  createNoteService,
  updateNoteService,
  softDeleteService,
};
