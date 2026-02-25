const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

router.get("/users/:userId/searching", noteController.searchNotes);
router.get("/:id", noteController.getNoteDetail);
router.post("/users/:userId", noteController.createNote);
router.put("/:id/users/:userId", noteController.updateNote);
router.patch("/:id", noteController.softDelete);

module.exports = router;
