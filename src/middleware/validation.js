const requiredProductFields = ['title','description','code','price','stock','category'];

const validateProductCreate = (req, res, next) => {
  const body = req.body || {};
  const missing = requiredProductFields.filter(f => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length) {
    return res.status(400).json({
      status: 'error',
      message: `Faltan campos requeridos: ${missing.join(', ')}`
    });
  }
  next();
};

const validateProductUpdate = (req, res, next) => {
  const body = req.body || {};
  if (!Object.keys(body).length) {
    return res.status(400).json({ status: 'error', message: 'Debe enviar al menos un campo para actualizar' });
  }
  // opcional -> normalizaciones mínimas
  if (body.price !== undefined)  body.price  = Number(body.price);
  if (body.stock !== undefined)  body.stock  = Number(body.stock);
  next();
};

const validateCartQuantity = (req, res, next) => {
  let { quantity } = req.body;

  if (quantity === undefined || quantity === null || quantity === "") {
    req.body.quantity = 1;
    return next();
  }

  const q = Math.trunc(Number(quantity));

  if (!Number.isFinite(q) || q < 1) {
    return res
      .status(400)
      .json({ status: "error", message: "quantity debe ser entero >= 1" });
  }

  req.body.quantity = q;
  next();
};

module.exports = { validateProductCreate, validateProductUpdate, validateCartQuantity };
