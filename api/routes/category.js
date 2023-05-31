const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');

const category = require('../controllers/categoryController')

router.get('/', category.getCategories);
router.get('/:id', category.categoryDetails );
router.post('/', category.createCategory);
module.exports = router;