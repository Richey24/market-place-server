const express = require("express");
const router = express.Router();
const multer = require('multer');
const popularProduct = require("../controllers/popularProduct")
const upload = multer({ dest: "./upload" })

router.post("/create", upload.single("image"), popularProduct.createPopular)
router.get("/get", popularProduct.getAllPopular)

module.exports = router;
