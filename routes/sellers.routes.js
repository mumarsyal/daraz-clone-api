const express = require('express');

const router = express.Router();

const sellersController = require('../controllers/sellers.controller');
// const authVerificationMiddleware = require('../middlewares/authVerification.middleware');

// router.post('', authVerificationMiddleware, sellersController.addSeller);
router.post('', sellersController.addSeller);
router.get('', sellersController.getSellers);
router.get('/:id', sellersController.getSeller);

module.exports = router;
