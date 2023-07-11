const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const productController = require("../controllers/productController");

router.get("/", productController.getProducts);

module.exports = router;
