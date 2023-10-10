const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const userController = require("../controllers/userController");
const asyncHandler = require("../../config/asyncHandler");

router.post("/register", asyncHandler(userController.register));
router.post("/login", asyncHandler(userController.loginUser));
router.post("/logout", asyncHandler(userController.logoutUser));

router.get("/me", auth, userController.getUserDetails);
router.put("/me", auth, userController.updateUserDetails);
router.put("/update/password", userController.updatePassword);
router.get("/customers/:companyId", userController.getCustomersByCompanyId);

//billing
router.post("/add-billing-address", userController.addBillingAddress);
router.post("/edit-billing-address/:id", auth, userController.editBillingAddress);
router.get("/billing", auth, userController.listBilling);

//shipping
router.post("/add-shipping-address", userController.addShippingAddress);
router.post("/edit-shipping-address/:id", auth, userController.editShippingAddress);
router.get("/shipping", auth, userController.listShipping);

module.exports = router;
