const mongoose = require('mongoose');
const crypto = require('crypto');

const sellerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	positiveRatings: {
		type: Number,
		required: true,
		default: () => crypto.randomInt(0, 101),
	},
	shipOnTime: {
		type: Number,
		required: true,
		default: () => crypto.randomInt(0, 101),
	},
	chatResponse: {
		type: Number,
		required: true,
		default: () => crypto.randomInt(0, 101),
	},
	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
});

module.exports = mongoose.model('Seller', sellerSchema);
