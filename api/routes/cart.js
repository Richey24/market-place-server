const auth = require('../../config/auth');

const express = require('express');
const router = express.Router();
const cart = require('../controllers/cartController');

router.get('/', auth,   cart.getCart); // get shopping cart
router.post('/',   cart.createCart ); // create new shopping cart
router.put('/:id', cart.updateCart );

module.exports = router;
