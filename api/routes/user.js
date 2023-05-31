const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');

const userController = require('../controllers/userController');

router.post('/register', userController.register)
router.post('/login', userController.loginUser )
router.post('/logout', userController.logoutUser )

router.get('/me', auth, userController.getUserDetails )

//billing
router.post('/add-billing-address', auth, userController.addBillingAddress)
router.post('/edit-billing-address/:id', auth, userController.editBillingAddress )
router.get('/billing', auth, userController.listBilling )

//shipping
router.post('/add-shipping-address', auth, userController.addShippingAddress);
router.post('/edit-shipping-address/:id', auth, userController.editShippingAddress);
router.get('/shipping', auth, userController.listShipping);

module.exports = router;