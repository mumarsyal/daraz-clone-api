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

module.exports = mongoose.model('Category', categorySchema);
