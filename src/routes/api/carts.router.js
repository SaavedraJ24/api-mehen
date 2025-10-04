const express = require("express");
const { validateCartQuantity } = require("../../middleware/validation");
const {
  createCart,
  getAllCarts,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  clearCart,
} = require("../../controllers/cart.controller");

const router = express.Router();

router.post("/", createCart);
router.get("/", getAllCarts);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid",validateCartQuantity, addProductToCart);
router.delete("/:cid/product/:pid", removeProductFromCart);
router.delete("/:cid", clearCart);

module.exports = router;
