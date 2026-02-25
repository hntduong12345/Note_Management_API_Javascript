const express = require("express");
const auth = require("../middlewares/jwt");

//Call Entity Controllers
const userHandlers = require("./userAPI");
const categoryHandlers = require("./categoryAPI");
const attachmentHandlers = require("./attachmentAPI");
const noteLinkHandlers = require("./noteLinkAPI");
const noteRevisionHandlers = require("./noteRevisionAPI");
const noteHandlers = require("./noteAPI");

const routerAPI = express.Router();

//Execute the middleware
// routerAPI.all("(.*)", auth);
routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Welcome to server");
});

//Set controller api
routerAPI.use("/users", userHandlers);
routerAPI.use("/categories", categoryHandlers);
routerAPI.use("/attachments", attachmentHandlers);
routerAPI.use("/note-links", noteLinkHandlers);
routerAPI.use("/note-revisions", noteRevisionHandlers);
routerAPI.use("/notes", noteHandlers);

module.exports = routerAPI;
