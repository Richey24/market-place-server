const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');

const router = express.Router();
const auth = require('../../config/auth');

const createCategoryDTO = require("../../schemas/category.schema")


const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findOne);
router.post('/', celebrate({ body: createCategoryDTO }), categoryController.create);
router.put('/:id', categoryController.update);

module.exports = router;