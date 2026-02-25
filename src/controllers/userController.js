// const {
//   registerService,
//   loginService,
//   getUserDetailByIdService,
//   getUserDetailByEmailService,
// } = require("../services/userService");
const userService = require("../services/userService");

//#region Auth Controllers
const register = async (req, res, next) => {
  try {
    const data = await userService.registerService(req.body);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await userService.loginService(req.body);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
//#endregion

//#region User Controllers
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = await userService.getUserDetailByIdService(userId);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getUserByEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    const data = await userService.getUserDetailByEmailService(email);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
//#endregion

module.exports = {
  register,
  login,
  getUserById,
  getUserByEmail,
};
