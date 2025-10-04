const CartManager = require("../dao/managers/CartManager");
const cm = new CartManager();

const createCart = async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getAllCarts = async (req, res) => {
  try {
    const carts = await cm.getAllCarts();
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const q = Math.max(1, Math.trunc(Number(quantity) || 1));
    const updated = await cm.addProductToCart(cid, pid, q);
    res.status(200).json({ status: "success", payload: updated });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updated = await cm.removeProductFromCart(cid, pid);
    res.status(200).json({ status: "success", payload: updated });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cleared = await cm.clearCart(cid);
    res.status(200).json({ status: "success", payload: cleared });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createCart,
  getAllCarts,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  clearCart,
};
