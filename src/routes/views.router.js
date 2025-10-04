const express = require("express");
const {
  renderHome,
  renderProducts,
  renderProductDetail,
  renderCartDetail,
  renderRealTimeProducts,
  renderLogin
} = require("../controllers/views.controller");

const router = express.Router();

router.get("/", renderHome);
router.get("/login", renderLogin);
router.get("/products", renderProducts);
router.get("/products/:pid", renderProductDetail);
router.get("/carts/:cid", renderCartDetail);
router.get("/realtimeproducts", renderRealTimeProducts);

module.exports = router;
