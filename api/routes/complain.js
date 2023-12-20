const express = require("express");
const { createComplain, getAllComplain } = require("../controllers/complainController");
const router = express.Router();

router.post("/create", createComplain)
router.get("/get/all", getAllComplain)

module.exports = router;
