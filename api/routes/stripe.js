const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

router.post("/", stripeController.stripeCheckout);
router.post(
     "/create-subscription-checkout-session",
     stripeController.createSubscriptionCheckoutSession,
);
router.post("/webhooks", stripeController.adsCallback);

module.exports = router;
