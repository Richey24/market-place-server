const express = require("express");
const { updateCompany, updateBrandColor } = require("../controllers/companyController");
const auth = require("../../config/auth");
const router = express.Router();

router.put("/update/:id", updateCompany);
router.put("/updateBrandColor/:companyId", auth, updateBrandColor);

module.exports = router;
