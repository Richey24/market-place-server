const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');

const productController = require('../controllers/productController')

router.get('/', productController.getProducts);
router.get('/featured', productController.filterProducts);
router.get('/details/:id', productController.productDetails );

module.exports = router;