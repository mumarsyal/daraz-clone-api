const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products.controller');
const authVerificationMiddleware = require('../middlewares/authVerification.middleware');

router.post('', authVerificationMiddleware, productsController.addProduct);
router.get('', productsController.getProducts);
router.get('/:id', productsController.getProduct);
router.delete(
	'/:id',
	authVerificationMiddleware,
	productsController.deleteProduct
);

module.exports = router;
