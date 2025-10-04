const Product = require("../models/productSchema"); // <- si el archivo se llama exactamente así

// Socket.IO con persistencia en Mongo
const registerRealTimeHandlers = (io, socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // Estado inicial desde DB
  Product.find({ isDeleted: false })
  .lean()
  .then(list => socket.emit("products:update", list))
  .catch(() => socket.emit("products:update", []));

  // Crear producto
  socket.on("product:create", async (payload) => {
    try {
      if (!payload?.title || payload.price == null) {
        return socket.emit("product:error", { message: "title y price son requeridos" });
      }

      const data = { ...payload };

      // Compat: thumbnail -> thumbnails[]
      if (data.thumbnail && !data.thumbnails) {
        data.thumbnails = [String(data.thumbnail)];
        delete data.thumbnail;
      }

      await Product.create(data);

      const list = await Product.find({ isDeleted: false }).lean();
      io.emit("products:update", list);
    } catch (err) {
      socket.emit("product:error", { message: err.message });
    }
  });

  // Eliminar (soft)
  socket.on("product:delete", async ({ id }) => {
    try {
      if (!id) return;
      await Product.findByIdAndUpdate(id, { isDeleted: true });
      const list = await Product.find({ isDeleted: false }).lean();
      io.emit("products:update", list);
    } catch (err) {
      socket.emit("product:error", { message: err.message });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`[socket] disconnected: ${socket.id} (${reason})`);
  });
};

// (Home / Products paginado)
const getProducts = async ({ limit = 10, page = 1, sort, category } = {}) => {
  const filter = { isDeleted: false };
  if (category) filter.category = category;

  const sortObj = {};
  if (sort) {
    const [f, d] = String(sort).split(":");
    sortObj[f] = d === "desc" ? -1 : 1;
  }

  const lim = Number(limit);
  const skip = (Number(page) - 1) * lim;

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortObj).skip(skip).limit(lim).lean(),
    Product.countDocuments(filter),
  ]);

  return { items, page: Number(page), totalPages: Math.ceil(total / lim) };
};

module.exports = { registerRealTimeHandlers, getProducts };
