const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const userController = require("../controllers/userController");
const asyncHandler = require("../../config/asyncHandler");

router.post("/register", asyncHandler(userController.register));
router.post("/social/register", asyncHandler(userController.socialRegister));
router.post("/confirm", asyncHandler(userController.confirmEmail));
router.post("/login", asyncHandler(userController.loginUser));
router.post("/logout", asyncHandler(userController.logoutUser));

router.get("/me", auth, userController.getUserDetails);
router.get("/me/customer/:id", userController.getUserDetails);
router.put("/me", auth, userController.updateUserDetails);
router.delete("/me", auth, userController.deleteAccount);
router.put("/me/customer", userController.updateUserDetails);
router.put("/update/password", auth, userController.updatePassword);
router.put("/update/password/customer", userController.updatePassword);
router.post("/forgot/password", userController.forgotPassword);
router.post("/reset/password", userController.resetPassword);
router.get("/customers/:companyId", userController.getCustomersByCompanyId);
router.put("/tour/update", auth, userController.updateTour);
router.get("/vendors", userController.getAllVendors);
router.post("/admin/mail", userController.sendAdminMail);
router.post("/vendor/mail", userController.sendVendorMail);
router.post("/notification", userController.sendNotification);

// ban user
router.get("/users", userController.getAllUsers);
router.get("/get/partner/:id", userController.getUserByPartnerID);
router.get("/get/company/:id", userController.getUserByCompanyID);
router.post("/ban", userController.banUser);
router.patch("/unban", userController.unbanUser);
router.post("/suspend", userController.suspendUser);
router.patch("/liftSuspension", userController.liftSuspension);

//billing
router.post("/add-billing-address", userController.addBillingAddress);
router.post("/edit-billing-address/:id", auth, userController.editBillingAddress);
router.get("/billing", userController.listBilling);

//shipping
router.post("/add-shipping-address", userController.addShippingAddress);
router.put("/edit-shipping-address", userController.updateShippingAddress);
router.get("/shipping/:partner_id", userController.listShipping);
router.delete("/shipping/:addressId/:userId", userController.deleteShippingAddress);

module.exports = router;
