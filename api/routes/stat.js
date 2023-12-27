const express = require("express");
const { createDownloadStat, getAllDownloadStat, getTopRatedProduct } = require("../controllers/statController");
const router = express.Router();

router.post("/download/create", createDownloadStat)
router.get("/download/get", getAllDownloadStat)
router.post("/toprated/get", getTopRatedProduct)

module.exports = router