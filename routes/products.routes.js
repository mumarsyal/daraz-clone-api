const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products.controller');
const authVerificationMiddleware = require('../middlewares/authVerification.middleware');

router.post('', authVerificationMiddleware, productsController.addProduct);
router.get('', authVerificationMiddleware, productsController.getProducts);
router.get('/brands', authVerificationMiddleware, productsController.getBrands);
router.get('/:id', authVerificationMiddleware, productsController.getProduct);
router.delete(
	'/:id',
	authVerificationMiddleware,
	productsController.deleteProduct
);
router.post('/reviews/new', authVerificationMiddleware, productsController.addReview);

module.exports = router;
