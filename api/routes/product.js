const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const multer = require("multer");
const productController = require("../controllers/productController");

router.get("/:companyId", auth, productController.getProductbyCompanyId);
// router.get("/:companyId/:productId", productController.getProductById);

router.get("/category/:category", auth, productController.getProductbyCategory);
router.post("/", auth, multer().any("images"), productController.createProduct);
router.put("/:id", auth, multer().any("images"), productController.updateProduct);
router.post("/multiple", productController.createMultipleProducts);

router.get("/:companyId/featured", productController.getFeaturedProducts);
router.get("/details/:id", productController.productDetails);
router.get("/filter", productController.filterProducts);
router.get("/site/:companyId", productController.getProductbyCompanyId);

module.exports = router;
