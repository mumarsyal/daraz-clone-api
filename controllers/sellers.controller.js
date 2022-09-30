const Seller = require('../models/seller.model');

const addSeller = (req, res, next) => {
	const seller = new Seller({
		name: req.body.name,
	});
	seller
		.save()
		.then((result) => {
			console.log('Seller added successfully:');
			console.log(result);
			res.status(201).json({
				message: 'Seller added successfully!',
			});
		})
		.catch((error) => {
			console.log("Seller couldn't be added:");
			console.log(error);
			res.status(500).json({
				message: "Seller couldn't be added! Please try again.",
			});
		});
};

const getSeller = (req, res, next) => {
	Seller.findOne({ _id: req.params.id })
		.then((result) => {
			console.log('Seller fetched successfully:');
			console.log(result);
			res.status(200).json({
				message: 'Seller fetched successfully!',
				seller: result,
			});
		})
		.catch((error) => {
			console.log('Seller fetching failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Seller couldn't be fetched. Please try again.",
			});
		});
};

const getAllSellers = (req, res) => {
	const query = Seller.find();
	let sellers;

	query
		.then((results) => {
			sellers = results;
			return Seller.count();
		})
		.then((count) => {
			res.status(200).json({
				message: 'Sellers fetched successfully!',
				sellers: sellers,
				totalSellers: count,
			});
		})
		.catch((error) => {
			console.log('Sellers fetching failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Sellers couldn't be fetched. Please try again.",
			});
		});
};

const getSellers = (req, res) => {
	const pageNum = req.query.pageNum ? +req.query.pageNum : 1;
	const pageSize = req.query.pageSize ? +req.query.pageSize : 10;

	const query = Seller.find().skip(pageSize * (pageNum - 1)).limit(pageSize);

	let sellers;

	query
		.then((results) => {
			sellers = results;
			return Seller.count();
		})
		.then((count) => {
			res.status(200).json({
				message: 'Sellers fetched successfully!',
				sellers: sellers,
				totalSellers: count,
				pageNum: pageNum,
				pageSize: pageSize,
			});
		})
		.catch((error) => {
			console.log('Sellers fetching failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Sellers couldn't be fetched. Please try again.",
			});
		});
};

const sellersControllers = {
	addSeller: addSeller,
	getSeller: getSeller,
	getSellers: getSellers,
};

module.exports = sellersControllers;
