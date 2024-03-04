const express = require("express");
const router = express.Router();
const authController = require("../controllers/dev/authController");
const productController = require("../controllers/dev/authController");

router.post("/auth/keys/generate", authController.generateAccessKeys);
router.post("/auth/keys/decrypt", authController.decryptAccessKeys);

///PRODUCTS
router.get("/products/:shopId", productController.decryptAccessKeys);
router.post("/product/:shopId", productController.decryptAccessKeys);

//
module.exports = router;
