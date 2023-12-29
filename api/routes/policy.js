const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");

router.post("/create", policyController.createPolicy);
router.put("/update", policyController.updatePolicy);

module.exports = router;
