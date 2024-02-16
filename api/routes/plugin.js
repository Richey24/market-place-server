const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const multer = require("multer");
const pluginController = require("../controllers/pluginController");

// router.get("/:companyId/:productId", productController.getProductById);

router.get("/", pluginController.getPlugins);
router.post("/", auth, pluginController.createPlugin);

module.exports = router;
