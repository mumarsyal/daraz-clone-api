const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	positiveRatings: {
		type: Number,
		required: true,
		default: () => Math.random() * 100,
	},
	shipOnTime: {
		type: Number,
		required: true,
		default: () => Math.random() * 100,
	},
	chatResponse: {
		type: Number,
		required: true,
		default: () => Math.random() * 100,
	},
	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
});

module.exports = mongoose.model('Seller', sellerSchema);
