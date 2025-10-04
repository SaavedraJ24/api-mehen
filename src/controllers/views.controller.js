const Product = require("../models/productSchema");
const Cart = require("../models/cartSchema");
const { getProducts } = require("../services/realTimeService");

// Home
const renderHome = async (req, res) => {
  try {
    const { items } = await getProducts({ limit: 8, sort: "createdAt:desc" });
    res.render("pages/home", { title: "Home", products: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listado productos
const renderProducts = async (req, res) => {
  try {
    const { limit = 8, page = 1, sort, category } = req.query;
    const { items, totalPages } = await getProducts({ limit, page, sort, category });

    res.render("pages/products", {
      title: "Productos",
      products: items,
      pagination: {
        page: Number(page),
        totalPages,
        baseUrl: `/products?limit=${limit}${sort ? `&sort=${sort}` : ""}${category ? `&category=${category}` : ""}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Detalle de producto
const renderProductDetail = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.pid).lean();
    if (!prod || prod.isDeleted) {
      return res.status(404).render("errors/404", { title: "Producto no encontrado" });
    }
    res.render("pages/productDetail", { title: prod.title, product: prod });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Detalle de carrito
const renderCartDetail = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) {
      return res.status(404).render("errors/404", { title: "Carrito no encontrado" });
    }

    const items = (cart.products || []).map(i => {
      const p = i.product || {};
      const subtotal = Number(p.price || 0) * Number(i.quantity || 0);
      return { ...i, product: p, subtotal };
    });
    const total = items.reduce((acc, it) => acc + it.subtotal, 0);

    res.render("pages/cartDetail", { title: `Carrito ${cart._id}`, items, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Real-time products
const renderRealTimeProducts = (req, res) => {
  res.render("pages/realTimeProducts", { title: "Tiempo real" });
};

// Login
const renderLogin = (req, res) => {
  try {
    res.render("pages/login", { title: "Login" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  renderHome,
  renderProducts,
  renderProductDetail,
  renderCartDetail,
  renderRealTimeProducts,
  renderLogin
};
