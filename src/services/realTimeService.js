let products = [
  // Arrancamos con 2 ítems “demo” para ver el render
  { id: rid(), title: 'Almohada Memory', price: 19999 },
  { id: rid(), title: 'Sábana King',    price: 24999 }
];

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

function registerSocketHandlers(io, socket) {
  console.log(`[socket] connected: ${socket.id}`);

  // Estado inicial al conectar
  socket.emit('products:update', products);

  // Crear
  socket.on('product:create', (payload) => {
    const { title, price } = payload || {};
    if (!title || isNaN(Number(price))) return; // validación mínima
    const prod = { id: rid(), title: String(title), price: Number(price) };
    products.push(prod);
    io.emit('products:update', products);
  });

  // Eliminar
  socket.on('product:delete', ({ id }) => {
    if (!id) return;
    products = products.filter(p => p.id !== id);
    io.emit('products:update', products);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[socket] disconnected: ${socket.id} (${reason})`);
  });
}

// Para que Home renderice lista “estática”
function getProducts() {
  return products;
}

module.exports = { registerSocketHandlers, getProducts };
