const attachmentService = require("../services/attachmentService");

const linkAttachment = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = await attachmentService.linkAttachmentService(
      req.body,
      userId,
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteAttachment = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const id = req.params.id;
    await attachmentService.deleteAttchmentService(id, userId);
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  linkAttachment,
  deleteAttachment,
};
