const express = require("express");
const { updateCompany } = require("../controllers/companyController");
const router = express.Router();

router.put("/update/:id", updateCompany)

module.exports = router;
