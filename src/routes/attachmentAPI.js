const express = require("express");
const router = express.Router();
const attachmentController = require("../controllers/attachmentController");
const { route } = require("./categoryAPI");

router.post("/users/:userId", attachmentController.linkAttachment);
router.delete(":id/users/:userId", attachmentController.deleteAttachment);

module.exports = router;
