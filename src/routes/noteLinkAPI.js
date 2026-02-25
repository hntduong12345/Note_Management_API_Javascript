const express = require("express");
const router = express.Router();
const noteLinkController = require("../controllers/noteLinkController");

router.get("/targets", noteLinkController.getTargetLinks);
router.get("/sources", noteLinkController.getSourceLinks);
router.post("/", noteLinkController.createLink);
router.delete("/:id", noteLinkController.removeLink);

module.exports = router;
