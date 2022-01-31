const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	title: { type: String, required: true },
	thumbnail: { type: String, required: true },
	rating: { type: Number, default: () => Math.random() * 5 },
	noOfRatings: { type: Number, default: () => Math.round(Math.random() * 100) },
	noOfQuesAsked: { type: Number, default: 0 },
	noOfQuesAnswered: { type: Number, default: 0 },
	brand: { type: String, default: null },
	currentPrice: { type: Number, required: true },
	oldPrice: { type: Number, default: null },
	freeShipping: { type: Boolean, default: false },
	colors: [{ type: String }],
	features: [{ type: String, required: true }],
	description: { type: String },
	images: [{ type: String, required: true }],
	sku: { type: String, required: true },
	model: { type: String, required: true },
	material: { type: String, required: true },
	inTheBox: [{ type: String, required: true }],
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Seller',
		required: true,
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

productSchema.pre('find', function (next) {
	this.populate('category').populate('seller').populate('reviews');
	next();
});

productSchema.pre('findOne', function (next) {
	this.populate('category').populate('seller').populate('reviews');
	next();
});

module.exports = mongoose.model('Product', productSchema);
