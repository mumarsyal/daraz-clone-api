const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
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

module.exports = mongoose.model('Category', categorySchema);
