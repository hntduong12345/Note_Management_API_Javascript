const express = require("express");
const auth = require("../middlewares/jwt");

const userHandlers = require("./userAPI");

const routerAPI = express.Router();

//Execute the middleware
// routerAPI.all("(.*)", auth);
routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Welcome to server");
});

//Set controller api
routerAPI.use("/users", userHandlers);

module.exports = routerAPI;
