require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

// init routes
app.get("/", (req, res) => {
  const strCompress = "tan test";

  return res
    .status(200)
    .json({ message: "Hello World!", metadata: strCompress.repeat(1000) });
});

// handle error

module.exports = app;
