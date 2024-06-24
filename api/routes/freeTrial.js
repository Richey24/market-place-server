const express = require("express");
const { changeFreeTrial, getFreetrial } = require("../controllers/freeTrialController");
const router = express.Router();

router.put("/change/:id", changeFreeTrial)
router.get("/get", getFreetrial)

module.exports = router;
