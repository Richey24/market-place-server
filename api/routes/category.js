const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validator");
const auth = require("../../config/auth");
const {
     createCategorySchema,
     createSubCategorySchema,
     getCategory,
} = require("../../schemas/category.schema");
const categoryController = require("../controllers/categoryController");

router.get("/:companyId", categoryController.findAll);
router.post("/", auth, categoryController.create);

module.exports = router;
