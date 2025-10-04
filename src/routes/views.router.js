const express = require("express");
const router = express.Router();
const { getProducts } = require("../services/realTimeService");

router.get("/", (req, res) => {
  res.render("pages/home", { title: "Home", products: getProducts() });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("pages/realTimeProducts", { title: "Productos en Tiempo Real" });
});

router.get("/login", (req, res) => {
  res.render("pages/login", { title: "Login" });
});

module.exports = router;
