const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products.controller');
const authVerificationMiddleware = require('../middlewares/authVerification.middleware');

router.post('', authVerificationMiddleware, productsController.addProduct);
router.get('', productsController.getProducts);
router.get('/brands', productsController.getBrands);
router.get('/:id', productsController.getProduct);
router.delete(
	'/:id',
	authVerificationMiddleware,
	productsController.deleteProduct
);
router.post('/reviews/new', productsController.addReview);

module.exports = router;
