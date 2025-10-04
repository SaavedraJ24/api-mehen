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











































// const fs = require("fs").promises;
// const crypto = require("crypto");

// class CartManager {
//   constructor(filePath) {
//     this.filePath = filePath;
//   }

//   async #readFile() {
//     try {
//       const data = await fs.promises.readFile(this.filePath, "utf-8");
//       console.log("data -> ", data);
//       return JSON.parse(data);
//     } catch (error) {
//       if (error.code === "ENOENT") return [];
//       throw error;
//     }
//   }

//   async #writeFile(products) {
//     try {
//       console.log(this.filePath);
//       await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
//     } catch (error) {
//       console.error("Error al escribir el archivo:", error);
//     }
//   }

//   //* POST -> / -> Crear nuevo carrito con ID único.
//   async createCart() {
//     try {
//       const carts = await this.#readFile();

//       const newCart = {
//         id: crypto.randomUUID(),
//         products: [],
//       };

//       carts.push(newCart);
//       await this.#writeFile(carts);
//       return newCart;
//     } catch (error) {
//       console.error("Ocurrió un error a la hora de crear el carrito.", error);
//     }
//   }

//   //* GET -> /:cid -> Obtener todos los productos del carrito.
//   async getCartByID(cid) {
//     try {
//       const carts = await this.#readFile();
//       const cart = carts.find((cart) => cart.id === cid);
//       if (!cart) {
//         console.log("CID incorrecto.");
//         return null;
//       }
//       return cart.products;
//     } catch (error) {
//       console.error(
//         "Ocurrió un error al intentar obtener todos los productos del carrito.",
//         error
//       );
//     }
//   }

//   //* POST -> /:cid/product/:pid -> Agregar producto al carrito (aumenta quantity si ya existe).
//   async addProductToCart(cid, pid) {
//     try {
//       const carts = await this.#readFile();
//       const cart = carts.find((cart) => cart.id === cid);
//       if (!cart) {
//         console.log("CID Incorrecto.");
//         return null;
//       }

//       const productInCart = cart.products.find((item) => item.id === pid);

//       if (productInCart) {
//         productInCart.quantity += 1;
//       } else {
//         cart.products.push({ id: pid, quantity: 1 });
//       }

//       await this.#writeFile(carts);
//       return cart;
//     } catch (error) {
//       console.error("Error al agregar producto al carrito", error);
//     }
//   }
// }

// module.exports = CartManager;