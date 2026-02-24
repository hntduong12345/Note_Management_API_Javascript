require("dotenv").config();
//Setup
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const errorHandler = require("./middlewares/errorHandler");
const configViewEngine = require("./config/viewEngine");
const { getHomepage } = require("./controllers/homeController");
const apiRoutes = require("./routes/api");

const app = express();
const port = process.env.PORT || 8888;

//CORS config
app.use(cors());

//Config request body data from FE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Set middleware
app.use(errorHandler);

//Config the template engine
configViewEngine(app);

//Setup Router
const webAPI = express.Router();
webAPI.use("/", getHomepage); //Use default home controller

//Route configuration
app.use("/v1/api/", apiRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(">>> Database Connected: PostgreSQL (Sequelize)");

    app.listen(port, () => {
      console.log(`Backend NodeJs App listening on port ${port}`);
    });
  } catch (error) {
    console.error(">>> Error connecting to Postgres DB: ", error);
    process.exit(1);
  }
})();
