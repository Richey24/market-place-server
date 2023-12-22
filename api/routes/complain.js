const express = require("express");
const { createComplain, getAllComplain, getComplainByCompanyID, getAdminComplain, updateAdminStatus, updateVendorStatus } = require("../controllers/complainController");
const router = express.Router();

router.post("/create", createComplain)
router.get("/get/all", getAllComplain)
router.get("/get/vendor/:id", getComplainByCompanyID)
router.get("/get/admin", getAdminComplain)
router.put("/update/admin/:id", updateAdminStatus)
router.put("/update/vendor/:id", updateVendorStatus)

module.exports = router;
