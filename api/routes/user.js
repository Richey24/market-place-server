const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const userController = require("../controllers/userController");
const asyncHandler = require("../../config/asyncHandler");

router.post("/register", asyncHandler(userController.register));
router.post("/login", asyncHandler(userController.loginUser));
router.post("/logout", asyncHandler(userController.logoutUser));

router.get("/me", auth, userController.getUserDetails);

//billing
router.post("/add-billing-address", auth, userController.addBillingAddress);
router.post("/edit-billing-address/:id", auth, userController.editBillingAddress);
router.get("/billing", auth, userController.listBilling);

//shipping
router.post("/add-shipping-address", auth, userController.addShippingAddress);
router.post("/edit-shipping-address/:id", auth, userController.editShippingAddress);
router.get("/shipping", auth, userController.listShipping);

module.exports = router;
