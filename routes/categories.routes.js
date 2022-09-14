const express = require('express');

const router = express.Router();

const categoriesController = require('../controllers/categories.controller');
const authVerificationMiddleware = require('../middlewares/authVerification.middleware');

router.post('', authVerificationMiddleware, categoriesController.addCategory);
router.get('', authVerificationMiddleware, categoriesController.getCategories);
router.get('/:id', authVerificationMiddleware, categoriesController.getCategory);
router.delete(
	'/:id',
	authVerificationMiddleware,
	categoriesController.deleteCategory
);

module.exports = router;
