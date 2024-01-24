const express = require("express");
const { createDownloadStat, getAllDownloadStat, getTopRatedProduct, getAllTopRatedProduct, getCompanyComplainStat } = require("../controllers/statController");
const router = express.Router();

router.post("/download/create", createDownloadStat)
router.get("/download/get", getAllDownloadStat)
router.post("/toprated/get", getTopRatedProduct)
router.post("/toprated/admin/get", getAllTopRatedProduct)
router.post("/complain/admin/get", getCompanyComplainStat)

module.exports = router