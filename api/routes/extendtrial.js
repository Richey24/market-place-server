const express = require("express");
const router = express.Router();
const extendtrialController = require("../controllers/extendtrialController");
const auth = require("../../config/auth");
const asyncHandler = require("../../config/asyncHandler");

router.post("/:companyId", auth, asyncHandler(extendtrialController.extendTrial));

module.exports = router;
