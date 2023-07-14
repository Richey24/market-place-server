const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const productController = require("../controllers/productController");

router.get("/", auth, productController.getProducts);
router.post("/", auth, productController.createProduct);
router.get("/featured", productController.getFeaturedProducts);
router.get("/details/:id", productController.productDetails);
router.get("/filter", productController.filterProducts);

module.exports = router;
