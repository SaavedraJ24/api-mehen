// in-CLIENT
// Conexion con el servidor de Socket.io
// const socket = io("http://mi-server-aparte.com")
const socket = io() // Por defecto, se conecta a 'http://localhost:8080'
// Si el día de mañana compramos un dominio -> agregamos ese dominio entre comillas en const socket = io("aqui-va-dominio-propio").


socket.on('connect', () => {
  console.log('[client] connected as', socket.id);
});


// AQUI VA TODO EL CODIGO JAVASCRIPT PARA USAR SOCKET.IO EN LA APP.
// DECIDIR QUE HACER AQUÍ Y APLICAR TAMBIEN SWEAT-ALERT (CDN EN MAIN.HBS).

/* ============================
   VISTA: realTimeProducts.hbs
   ============================ */

// Render helper para la UL de realtime
const renderRtList = (list) => {
  const ul = document.querySelector('#rt-products');
  if (!ul) return;
  ul.innerHTML = (list || []).map(p => `
    <li>
      <strong>${escapeHtml(p.title)}</strong> — $ ${Number(p.price)}
      <button class="rt-delete" data-id="${p.id}">Eliminar</button>
    </li>
  `).join('');
};

// Recibe broadcast del servidor
socket.on('products:update', (list) => renderRtList(list));

// Crear producto desde el form
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'rt-form') return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.price = Number(data.price);
  if (!data.title || isNaN(data.price)) return;
  socket.emit('product:create', data);
  e.target.reset();
});

// Eliminar producto (delegación)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.rt-delete');
  if (!btn) return;
  socket.emit('product:delete', { id: btn.dataset.id });
});

// Pequeño escape XSS
const escapeHtml = (str) => {
  return String(str).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}