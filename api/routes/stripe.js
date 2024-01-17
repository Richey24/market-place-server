const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController")

router.post("/vendor/subscription/create", stripeController.createVendorSubscription)
router.post("/vendor/webhook", express.raw({ type: 'application/json' }), stripeController.stripeVendorCallback)
router.post("/vendor/subscription/cancel/:id", stripeController.cancelVendorSubscription)
router.post("/", stripeController.stripeCheckout);
router.post(
     "/create-subscription-checkout-session",
     stripeController.createAdsCheckoutSession,
);
router.post("/webhooks", stripeController.adsCallback);
router.post("/cancel/mail", stripeController.sendCancelEmail);

module.exports = router;
