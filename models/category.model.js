const mongoose = require('mongoose');

const Product = require('./product.model');

const categorySchema = new mongoose.Schema({
	title: { type: String, required: true },
	imagePath: { type: String, required: true },
	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
});

categorySchema.pre('find', function (next) {
	this.populate('products');
	next();
});

categorySchema.pre('findOne', function (next) {
	this.populate('products');
	next();
});

categorySchema.pre('deleteOne', function (next) {
	const categoryId = this.getQuery()._id;
	Product.updateMany(
		{ category: categoryId },
		{ $unset: { category: 1 } },
	).exec();
	next();
});

module.exports = mongoose.model('Category', categorySchema);
