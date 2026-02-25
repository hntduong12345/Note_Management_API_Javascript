const noteLinkService = require("../services/noteLinkService");

const createLink = async (req, res, next) => {
  try {
    const data = await noteLinkService.createLinkService(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const removeLink = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const id = req.params.id;
    await noteLinkService.removeLinkService(id, userId);
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

const getSourceLinks = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const noteId = req.params.noteId;
    const data = await noteLinkService.getSourceLinksService(noteId, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getTargetLinks = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const noteId = req.params.noteId;
    const data = await noteLinkService.getTargetLinksService(noteId, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLink,
  removeLink,
  getSourceLinks,
  getTargetLinks,
};
