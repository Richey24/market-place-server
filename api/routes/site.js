const express = require("express");
const router = express.Router();
const siteController = require("../controllers/siteController");
const auth = require("../../config/auth");

router.get("/:domain", siteController.getSiteByDomain);
router.patch("/:id", siteController.updateSiteById);

module.exports = router;
