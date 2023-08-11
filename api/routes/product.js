const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const multer = require("multer");
const productController = require("../controllers/productController");

router.get("/:companyId", auth, productController.getProductbyCompanyId);
router.post("/", auth, multer().any("images"), productController.createProduct);
router.get("/featured", productController.getFeaturedProducts);
router.get("/details/:id", productController.productDetails);
router.get("/filter", productController.filterProducts);

module.exports = router;
