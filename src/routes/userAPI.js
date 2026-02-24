const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/:id", userController.getUserById);
router.post("/email", userController.getUserByEmail);

module.exports = router;
