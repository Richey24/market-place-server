const express = require("express");
const router = express.Router();
const mainCategoryController = require("../controllers/mainCategoryController")

router.post("/create", mainCategoryController.createMainCategory)
router.get("/get", mainCategoryController.getAllCategory)

module.exports = router;
