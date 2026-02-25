const express = require("express");
const router = express.Router();
const noteRevisionController = require("../controllers/noteRevisionController");

router.get("/", noteRevisionController.getRevisionHistory);
router.get("/:id", noteRevisionController.getRevisionDetail);
router.post("/", noteRevisionController.createRevision);
router.put("/:id", noteRevisionController.restoreRevision);

module.exports = router;
