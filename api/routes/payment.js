const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

router.post("/create-paymentIntent", paymentController.createPaymentIntents);
router.get("/get-connected-account-verify-links", paymentController.generateAccountLink);
router.get("/check-connected-account-status", paymentController.checkConnectedAccountStatus);
router.post("/connect-external-accounts", paymentController.connectExternalAccount);
router.get("/get-all-external-accounts", paymentController.getAllExternalAccounts);
router.put("/update-payment-method", paymentController.updatePaymentMethod);

router.delete(
     "/delete-external-account/:accountId/:payoutMethodId",
     paymentController.deleteExternalAccount,
);


router.post("/private-checkout-link", paymentController.privatOrderCheckout);

module.exports = router;
