const validateProductBody = (req, res, next) => {
  const { title, code, price, category } = req.body;
  if (!title || !code || typeof price === 'undefined' || !category) {
    return res.status(400).json({ status:'error', message:'Campos requeridos: title, code, price, category' });
  }
  if (Number.isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ status:'error', message:'price inválido' });
  }
  next();
};

const validateCartQuantity = (req, res, next) => {
  const { quantity } = req.body;
  if (typeof quantity === 'undefined'){
    return next();
  } 
    
  const q = Number(quantity);
  
  if (!Number.isInteger(q) || q < 1) {
    return res.status(400).json({ status:'error', message:'quantity debe ser entero >= 1' });
  }
  next();
};

module.exports = { validateProductBody, validateCartQuantity };
