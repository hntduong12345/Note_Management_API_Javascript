const express = require("express");
const auth = require("../middlewares/jwt");

//Call Entity Controllers
const userHandlers = require("./userAPI");
const categoryHandlers = require("./categoryAPI");

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

module.exports = routerAPI;
