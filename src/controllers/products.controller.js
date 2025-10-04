const ProductManager = require("../dao/managers/ProductManager");
const pm = new ProductManager();

const getAllProducts = async (req, res) => {
  try {
    const data = await pm.getAllProducts(req.query);
    res.status(200).json({ status: "success", ...data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const doc = await pm.getProductById(req.params.id);
    if (!doc || doc.isDeleted) {
      return res
        .status(404)
        .json({ status: "error", message: "product not found." });
    }
    return res.status(200).json({ status: "success", payload: doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const created = await pm.addNewProduct(req.body);
    res.status(201).json({ status: "success", payload: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await pm.updateProductByID(req.body, req.params.id);
    if (!updated) {
        return res.status(404).json({ status: "error", message: "product not found" });
    }
    return res.status(200).json({ status: "success", payload: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await pm.deleteProductByID(req.params.id);
    if (!deleted) {
        return res.status(404).json({ status: "error", message: "product not found" });
    }
    return res.status(200).json({ status: "success", payload: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct, 
  deleteProduct
};
