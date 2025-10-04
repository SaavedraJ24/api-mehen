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

    const skip = (Number(page) - 1) * Number(limit);

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

// const fs = require("fs").promises;
// const crypto = require("crypto");

// class ProductManager {
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

//   //* GET -> / -> Obtener todos los productos.
//   async getAllProducts() {
//     try {
//       const products = await this.#readFile();
//       console.log("Productos -> ", products);
//       return products;
//     } catch (error) {
//       console.error("Error al leer todos los productos", error);
//     }
//   }

//   //* GET -> /:pid -> Obtener producto por ID.
//   async getProductByID(id) {
//     try {
//       const products = await this.#readFile();
//       const product = products.find((item) => item.id === id);
//       console.log("Product -> ", product);
//       if (!product) {
//         console.log("Id incorrecto");
//         return;
//       }
//       return product;
//     } catch (error) {
//       console.error("Error al leer producto por ID.", error);
//     }
//   }

//   //* POST -> / -> Crear un nuevo producto (ID se autogenera).
//   async addNewProduct({
//     title,
//     author,
//     description,
//     code,
//     price,
//     status,
//     stock,
//     category,
//     thumbnail,
//   }) {
//     try {
//       if (
//         !title ||
//         !author ||
//         !description ||
//         !code ||
//         !price ||
//         !status ||
//         !stock ||
//         !category ||
//         !thumbnail
//       ) {
//         throw new Error(
//           "No se pudo crear el producto! -> Todos los campos son obligatorios."
//         );
//       }
//       const products = await this.#readFile();
//       const newProduct = {
//         id: crypto.randomUUID(),
//         title,
//         author,
//         description,
//         code,
//         price,
//         status,
//         stock,
//         category,
//         thumbnail,
//       };
//       products.push(newProduct);
//       await this.#writeFile(products);
//     } catch (error) {
//       console.error("Error al crear nuevo producto.", error);
//     }
//   }

//   //* PUT -> /:pid -> Debe actualizar un producto por los campos enviados desde el body.
//   // No se debe actualizar ni eliminar el id al momento de hacer la actualización.
//   async updateProductByID(dataUpdateProduct, id) {
//     try {
//       const products = await this.#readFile();
//       const index = products.findIndex((item) => item.id === id);
//       if (index === -1) {
//         console.log("ID incorrecto");
//         return null;
//       }

//       const currentProduct = products[index];

//       const { id: _, ...restData } = dataUpdateProduct;

//       const updatedProduct = {
//         ...currentProduct,
//         ...restData,
//       };

//       products[index] = updatedProduct;

//       await this.#writeFile(products);

//       return updatedProduct;
//     } catch (error) {
//       console.error("No se pudo actualizar el producto.", error);
//     }
//   }

//   //* DELETE -> /:pid -> Eliminar producto por ID.
//   async deleteProductByID(id) {
//     try {
//       const products = await this.#readFile();
//       const productByID = products.findIndex((item) => item.id === id);
//       if (productByID === -1) {
//         console.log("ID incorrecto");
//         return null;
//       }
//       products.splice(productByID, 1);
//       await this.#writeFile(products);
//       console.log(`Producto de ID: ${id}, eliminado correctamente.`);
//     } catch (error) {
//       console.error(
//         "Ocurrió un error al intentar eliminar el producto.",
//         error
//       );
//     }
//   }
// }

// module.exports = ProductManager;
