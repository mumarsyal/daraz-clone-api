const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	reviewBy: { type: String, required: true },
	rating: { type: Number, default: () => Math.random() * 5 },
	verifiedPurchase: { type: Boolean, default: false },
	reviewDate: { type: Date, default: Date.now },
	comment: { type: String, required: true },
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
});

// reviewSchema.pre('save', function (next) {
// 	this.reviewDate = randomDate();
// 	next();
// });

// function randomDate() {
// 	const start = new Date(2021, 1, 1);
// 	const end = new Date();
// 	return new Date(
// 		start.getTime() + Math.random() * (end.getTime() - start.getTime())
// 	);
// }

module.exports = mongoose.model('Review', reviewSchema);
