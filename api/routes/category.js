const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validator')
const auth = require('../../config/auth');
const { createCategorySchema, createSubCategorySchema } = require("../../schemas/category.schema")
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.findAll);
router.post('/', validate(createCategorySchema), categoryController.create);
router.get('/:id', categoryController.findOne);
router.patch('/:id', categoryController.update);
router.delete('/:id', categoryController.deleteCategory);
router.post('/subcategory', validate(createSubCategorySchema), categoryController.createSubCategory)

module.exports = router;