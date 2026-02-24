require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const saltRounds = 12;

const User = require("../models/User");

//Service functions
//#region Auth Services
const registerService = async (userData) => {
  const { email, password } = userData;

  //Check is email used for registering
  const existingUser = await User.findOne({ where: { email: email } });
  if (existingUser)
    throw new AppError("Email is already in use. Please try another one", 400);

  //Hashing password
  const hashPass = bcrypt.hash(password, saltRounds);

  //Registering user
  const newUser = await User.create({
    email: email,
    password: hashPass,
  });

  //Create jwt
  const payload = { email: newUser.email };
  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return {
    access_token,
    user: {
      email: newUser.email,
    },
  };
};

const loginService = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({
    email: email,
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  //Create jwt
  const payload = { email: user.email };
  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return {
    access_token,
    user: {
      email: user.email,
    },
  };
};
//#endregion

//#region User Services
const getUserDetailByIdService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password", "mfaSecret"] },
  });

  if (!user) {
    throw new AppError("User is note found", 404);
  }

  return user;
};

const getUserDetailByEmailService = async (email) => {
  const user = await User.findOne(
    { where: { email: email } },
    {
      attributes: { exclude: ["password", "mfaSecret"] },
    },
  );

  if (!user) {
    throw new AppError("User is note found", 404);
  }

  return user;
};
//#endregion

module.exports = {
  registerService,
  loginService,
  getUserDetailByIdService,
  getUserDetailByEmailService,
};
