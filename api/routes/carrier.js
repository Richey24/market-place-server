const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const multer = require("multer");
const carrierController = require("../controllers/carrierController");

// router.get("/:companyId/:productId", productController.getProductById);

router.get("/", carrierController.getCarriers);
router.post("/", carrierController.createCarrier);
// router.get("/all", carrierController.getAllCarrriers);
router.post("/company/:companyId", carrierController.selectCarrierByCompanyId);
router.get("/company/:companyId", carrierController.getCarriersByCompanyId);

module.exports = router;
