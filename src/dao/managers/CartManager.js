const Cart = require("../../models/cartSchema");
const Product = require("../../models/productSchema");

class CartManager {
  // Crear carrito vacío
  async createCart() {
    return await Cart.create({ products: [] });
  }

  // Obtener todos los carritos
  async getAllCarts() {
    return await Cart.find().populate("products.product").lean();
  }

  // Obtener carrito por ID (POPULATE)
  async getCartById(cid) {
    return await Cart.findById(cid).populate("products.product").lean();
  }

  // Agregar producto a carrito
  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await Cart.findById(cid);

    if (!cart) {
      throw new Error("Cart not found.");
    }

    const product = await Product.findById(pid);
    if (!product || product.isDeleted) {
      throw new Error("Product not found");
    }

    const existing = cart.products.find(p => p.product.equals(pid));

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return await cart.populate("products.product");
  }

  // Eliminar producto del carrito
  async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = cart.products.filter(p => !p.product.equals(pid));

    await cart.save();
    return await cart.populate("products.product");
  }

  // Vaciar carrito completo
  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) {
      throw new Error("Cart not found.");
    }

    cart.products = [];

    await cart.save();
    return cart;
  }

  // Actualizar cantidad específica
  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) {
      throw new Error("Cart not found.");
    }

    const item = cart.products.find(p => p.product.equals(pid));
    
    if (!item) {
      throw new Error("Product not in cart.");
    }

    item.quantity = quantity;

    await cart.save();
    return await cart.populate("products.product");
  }

  // Reemplazar array completo
  async replaceCartProducts(cid, newProducts = []) {
    const cart = await Cart.findById(cid);

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = newProducts;
    
    await cart.save();
    return await cart.populate("products.product");
  }
}

module.exports = CartManager;