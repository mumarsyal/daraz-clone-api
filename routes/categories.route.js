const express = require('express');

const router = express.Router();

const categoriesController = require('../controllers/categories.controller');

router.post('', categoriesController.addCategory);
router.get('', categoriesController.getCategories);
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;
