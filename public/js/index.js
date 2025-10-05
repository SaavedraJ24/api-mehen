// in-CLIENT
// Conexion con el servidor de Socket.io
// const socket = io("http://mi-server-aparte.com")
const socket = io(); // Por defecto, se conecta a 'http://localhost:8080'
// Si el día de mañana compramos un dominio -> agregamos ese dominio entre comillas en const socket = io("aqui-va-dominio-propio").

socket.on("connect", () => {
  console.log("[client] connected as", socket.id);
});

// Render helper para la UL de realtime
if (document.getElementById("rt-form")) {
  const renderRtList = (list) => {
    const ul = document.querySelector("#rt-products");
    if (!ul) {
      return;
    }
    ul.innerHTML = (list || []).map((p) => `<li>
                    <strong>${p.title}</strong> — $ ${Number(p.price)}
                    <button class="rt-delete" data-id="${p._id}">Eliminar</button>
                  </li>`).join("");
  };
  socket.on("products:update", renderRtList);
  socket.on("product:error", (e) => {
    const msg = e?.message || "No se pudo crear el producto";
    if (window.Swal) {
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } else {
      alert(msg);
    }
    console.error("[socket] product:error", e);
  });

  document.addEventListener("submit", (e) => {
    if (e.target.id !== "rt-form") return;
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.price = Number(data.price);
    if (!data.title || isNaN(data.price)) return;
    socket.emit("product:create", data);
    e.target.reset();
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".rt-delete");
    if (!btn) return;
    socket.emit("product:delete", { id: btn.dataset.id });
  });
}
