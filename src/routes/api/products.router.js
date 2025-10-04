const express = require('express');
const { validateProductCreate, validateProductUpdate } = require('../../middleware/validation');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../../controllers/products.controller');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', validateProductCreate, createProduct);
router.put('/:id', validateProductUpdate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
