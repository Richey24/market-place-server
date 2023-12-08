const express = require("express");
const { createDownloadStat, getAllDownloadStat } = require("../controllers/StatController");
const router = express.Router();

router.post("/download/create", createDownloadStat)
router.get("/download/get", getAllDownloadStat)

module.exports = router