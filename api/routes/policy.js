const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");

router.get("/", policyController.getPolicyBySiteId);
router.post("/create", policyController.createPolicy);
router.put("/update", policyController.updatePolicy);
router.get("/get-policy-by-type", policyController.getPolicyByType);

module.exports = router;
