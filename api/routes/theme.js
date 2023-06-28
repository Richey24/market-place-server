const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const themeController = require('../controllers/themeController')

router.get("",  themeController.getThemes);
router.post("", themeController.addThemes );

module.exports = router;
