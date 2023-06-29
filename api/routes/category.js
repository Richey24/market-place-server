const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validator')
const auth = require('../../config/auth');
const { createCategorySchema, createSubCategorySchema, getCategory } = require("../../schemas/category.schema")
const categoryController = require('../controllers/category.controller');
const catController = require('../controllers/categoryController');

router.get('/:companyId', validate(getCategory), categoryController.findAll);
router.post('/', auth, validate(createCategorySchema), categoryController.create);
router.get('/:id', categoryController.findOne);
router.patch('/:id', auth, categoryController.update);
router.post('/subcategory', auth, validate(createSubCategorySchema), categoryController.createSubCategory)
router.get('/featured', catController.fetchFeatureCategories);


module.exports = router;