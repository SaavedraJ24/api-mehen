const express = require("express");
const router = express.Router();

const viewsRouter = require("./views.router");
const apiRouter = require("./api");

// Vistas con Handlebars
router.use("/", viewsRouter);

// Endpoints API
router.use("/api", apiRouter);

module.exports = router;
