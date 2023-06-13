const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');

const wishlistController = require('../controllers/wishlistController')

router.post('/', wishlistController.createWishlist);
router.get('/', wishlistController.getWishlist);

module.exports = router