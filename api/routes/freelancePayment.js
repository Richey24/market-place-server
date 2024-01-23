const express = require("express");
const router = express.Router();
const freelancerPaymentInfo = require("../controllers/freelancePaymentInfo");

router.post("/create", freelancerPaymentInfo.createPaymentInfo)
router.put("/update/:id", freelancerPaymentInfo.updatePaymentInfo)
router.get("/get/user/:id", freelancerPaymentInfo.findAllPaymentInfoByUser)
router.get("/get/one/:id", freelancerPaymentInfo.findOnePaymentInfo)
router.delete("/delete/:id", freelancerPaymentInfo.deletePaymentInfo)

module.exports = router;
