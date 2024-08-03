const express = require("express");
const cors = require("cors");
require('express-async-errors')
const middleware = require("./utils/middleware.js");
const blogsRouter = require("./controllers/blogs.js");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const app = express();

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)

  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
