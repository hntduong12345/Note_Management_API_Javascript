const noteService = require("../services/noteService");

const searchNotes = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { q = "", page = 0, size = 10 } = req.query;
    const limit = parseInt(size);
    const offset = parseInt(page) * limit;

    const data = await noteService.searchNotesService(q, userId, limit, offset);
    res.status(200).json({
      totalElements: data.totalElements,
      page: parseInt(page),
      size: limit,
      data: data.data,
    });
  } catch (error) {}
};

const getNoteDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await noteService.getNoteDetailService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = await noteService.createNoteService(req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const id = req.params.id;
    const data = await noteService.updateNoteService(id, req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const softDelete = async (req, res, next) => {
  try {
    const id = req.params.id;
    await noteService.softDeleteService(id);
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchNotes,
  getNoteDetail,
  createNote,
  updateNote,
  softDelete,
};
