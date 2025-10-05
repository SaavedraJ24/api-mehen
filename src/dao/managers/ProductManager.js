//DAO con Mongoose
const Product = require("../../models/productSchema");

class ProductManager {
  // GET /api/products + paginacion/filtros/sort y limit
  async getAllProducts(opts = {}) {
    const { limit = 10, page = 1, sort, query, includeDeleted = false } = opts;

    const filter = {};
    if (!includeDeleted) {
      filter.isDeleted = false;
    }

    if (query) {
      const [k, v] = String(query).split(":");
      if (k === "category") {
        filter.category = v;
      }
      if (k === "available") {
        filter.status = v === "true";
      }
      if (k === "code") {
        filter.code = v;
      }
    }
    const sortObj = {};
    if (sort) {
      const [field, dir] = String(sort).split(":");
      sortObj[field] = dir === "desc" ? -1 : 1;
    }

    const lim  = Number(limit);
    const skip = (Number(page) - 1) * lim;

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(lim).lean(),
      Product.countDocuments(filter),
    ]);
    return {
      docs: items,
      page: Number(page),
      limit: lim,
      totalDocs: total,
      totalPages: Math.ceil(total / lim),
    };
  }

  // GET /api/products/:id
  async getProductById(id) {
    if (!id) {
      return null;
    }
    return await Product.findById(id).lean();
  }

  // POST /api/products
  async addNewProduct(payload) {
    if (!payload) {
      throw new Error("payload is required");
    }
    // mapeo compatibilidad thumbnail -> thumbnails
    const data = { ...payload };
    if (data.thumbnail && !data.thumbnails) {
      data.thumbnails = [String(data.thumbnail)];
      delete data.thumbnail;
    }
    return await Product.create(data);
  }

  // PUT /api/products/:id  (no permitir cambiar _id)
  async updateProductByID(dataUpdateProduct, id) {
    if (!id) {
      throw new Error("id is required");
    }
    const { id: _omit1, _id: _omit2, ...update } = dataUpdateProduct || {};

    // mapeo compatibilidad thumbnail -> thumbnails
    if (update.thumbnail && !update.thumbnails) {
      update.thumbnails = [String(update.thumbnail)];
      delete update.thumbnail;
    }

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    return updated ? updated.toJSON?.() || updated : null;
  }

  // SOFT DELETE /api/products/:id
  async deleteProductByID(id) {
    if (!id) {
      throw new Error("id is required.");
    }
    const deleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    return deleted ? deleted.toJSON() || deleted : null;
  }
}
module.exports = ProductManager;