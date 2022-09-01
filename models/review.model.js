const mongoose = require('mongoose');
const crypto = require('crypto');

const reviewSchema = new mongoose.Schema({
	reviewBy: { type: String, required: true },
	rating: { type: Number, default: () => crypto.randomInt(0, 6) },
	verifiedPurchase: { type: Boolean, default: false },
	reviewDate: { type: Date, default: Date.now },
	comment: { type: String, required: true },
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
});

module.exports = mongoose.model('Review', reviewSchema);
