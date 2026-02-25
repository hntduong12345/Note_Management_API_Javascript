const noteRevisionService = require("../services/noteRevisionService");

const createRevision = async (req, res, next) => {
  try {
    const noteId = req.query.noteId;
    const userId = req.query.userId;
    await noteRevisionService.createRevisionService(noteId, userId, req.body);
    res.status(201).json(null);
  } catch (error) {
    next(error);
  }
};

const getRevisionHistory = async (req, res, next) => {
  try {
    const noteId = req.query.noteId;
    const userId = req.query.userId;
    const data = await noteRevisionService.getRevisionHistoryService(
      noteId,
      userId,
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getRevisionDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.query.userId;
    const data = await noteRevisionService.getRevisionDetailService(id, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const restoreRevision = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.query.userId;
    const data = await noteRevisionService.restoreRevisionService(id, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRevision,
  getRevisionDetail,
  getRevisionHistory,
  restoreRevision,
};
