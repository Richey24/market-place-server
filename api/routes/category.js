const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validator')
const auth = require('../../config/auth');
const { createCategorySchema, idSchema } = require("../../schemas/category.schema")
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findOne);
router.post('/', validate(createCategorySchema), categoryController.create);
router.put('/:id', categoryController.update);

module.exports = router;