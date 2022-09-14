const express = require('express');

const router = express.Router();

const sellersController = require('../controllers/sellers.controller');
const authVerificationMiddleware = require('../middlewares/authVerification.middleware');

router.post('', authVerificationMiddleware, sellersController.addSeller);
router.get('', authVerificationMiddleware, sellersController.getSellers);
router.get('/:id', authVerificationMiddleware, sellersController.getSeller);

module.exports = router;
