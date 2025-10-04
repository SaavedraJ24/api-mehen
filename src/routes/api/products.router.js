const express = require('express');
const { validateProductBody } = require('../../middleware/validation');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../../controllers/products.controller');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', validateProductBody, createProduct);
router.put('/:id', validateProductBody, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
