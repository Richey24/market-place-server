const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');

const productController = require('../controllers/productController')

router.get('/', productController.getProducts);
router.get('/filter', productController.filterProducts)
router.post('/', productController.createProduct);
router.get('/featured', productController.getFeaturedProducts);
router.get('/details/:id', productController.productDetails );

module.exports = router;