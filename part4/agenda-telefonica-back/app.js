const express = require("express");
const cors = require("cors");
const contactsRouter = require("./controllers/contacts");
const middleware = require("./utils/middleware.js");
const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/contacts", contactsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
