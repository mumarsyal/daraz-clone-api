const express = require('express');

const router = express.Router();

const sellersController = require('../controllers/sellers.controller');

router.post('', sellersController.addSeller);
router.get('', sellersController.getSellers);
router.get('/:id', sellersController.getSeller);

module.exports = router;
