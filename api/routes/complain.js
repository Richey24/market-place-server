const express = require("express");
const { createComplain, getAllComplain, getComplainByCompanyID, getAdminComplain } = require("../controllers/complainController");
const router = express.Router();

router.post("/create", createComplain)
router.get("/get/all", getAllComplain)
router.get("/get/vendor/:id", getComplainByCompanyID)
router.get("/get/admin", getAdminComplain)

module.exports = router;
