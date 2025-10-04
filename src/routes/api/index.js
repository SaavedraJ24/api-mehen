const express = require('express');
const productsRouter = require('./products.router');
const cartsRouter = require('./carts.router');

const router = express.Router();
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
module.exports = router;
