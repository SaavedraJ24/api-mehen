(() => {
  const API = {
    createCart: async () => {
      const res = await fetch("/api/carts", { method: "POST" });
      if (!res.ok) {
        throw new Error("No se pudo crear el carrito");
      }
      const json = await res.json();
      return json.payload?._id;
    },
    addItem: async (cid, pid, quantity = 1) => {
      const res = await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number(quantity) || 1 }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "No se pudo agregar el producto");
      }
      return res.json();
    },
  };

  const getCartId = async () => {
    let cid = localStorage.getItem("cartId");
    if (!cid) {
      cid = await API.createCart();
      localStorage.setItem("cartId", cid);
    }
    return cid;
  };

  const handleAdd = async (pid, qty = 1) => {
    try {
      const cid = await getCartId();
      await API.addItem(cid, pid, qty);
      if (window.Swal) {
        Swal.fire({
          icon: "success",
          title: "Agregado!",
          text: "Producto añadido al carrito",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        console.log("[cart] añadido", { cid, pid, qty });
      }
    } catch (error) {
      if (window.Swal) {
        Swal.fire({
          icon: "error",
          title: "Oh no!",
          text: error.message || "Error inesperado",
        });
      } else {
        alert(error.message || "Error");
      }
    }
  };

  // Catálogo
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add-cart");
    if (!btn) return;
    const pid = btn.dataset.pid;
    const raw = btn.dataset.qty; 
    const qty = Math.max(1, Math.trunc(Number(raw) || 1));
    if (pid) handleAdd(pid, qty);
  });

  // Detalle (form)
  const form = document.getElementById("add-to-cart-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const pid = form.querySelector('button[type="submit"]')?.dataset.pid;
    const raw = new FormData(form).get("quantity");
    const qty = Math.max(1, Math.trunc(Number(raw) || 1));
    if (pid) handleAdd(pid, qty);
  });
})();
