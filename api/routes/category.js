const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validator')
const auth = require('../../config/auth');
const { createCategorySchema, createSubCategorySchema } = require("../../schemas/category.schema")
const categoryController = require('../controllers/category.controller');
const catController = require('../controllers/categoryController');

router.get('/featured', catController.fetchFeatureCategories );
router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findOne);
router.post('/', validate(createCategorySchema), categoryController.create);
router.patch('/:id', categoryController.update);
router.post('/subcategory', validate(createSubCategorySchema), categoryController.createSubCategory)


module.exports = router;