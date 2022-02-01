const multer = require('multer');

const Product = require('../models/product.model');
const fileUploadMiddleware = require('../middlewares/fileUpload.middleware');
const Review = require('../models/review.model');

const addProduct = (req, res, next) => {
	fileUploadMiddleware(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			return res.status(500).json({
				message: 'Sorry! Image could not be uploaded. Please try again.',
			});
		} else if (err) {
			return res.status(422).json({
				message: 'Invalid file type',
			});
		}

		// Everything went fine
		const url = req.protocol + '://' + req.get('host');
		let images = [];
		for (const key in req.files) {
			if (Object.hasOwnProperty.call(req.files, key)) {
				const image = req.files[key];
				images.push(
					`${url}/${process.env.IMAGE_UPLOADS_FOLDER}/${image.filename}`
				);
			}
		}

		if (!images.length) {
			res.status(500).json({
				message: "Product couldn't be added! Please try again.",
			});
		}

		const product = new Product({
			title: req.body.title,
			thumbnail: images[0],
			brand: req.body.brand === 'null' ? null : req.body.brand,
			currentPrice: +req.body.currentPrice,
			oldPrice: req.body.oldPrice === 'null' ? null : +req.body.oldPrice,
			freeShipping: req.body.freeShipping,
			colors: req.body.colors,
			features: req.body.features,
			description: req.body.description,
			images: images,
			sku: req.body.sku,
			model: req.body.model,
			material: req.body.material,
			inTheBox: req.body.inTheBox,
			category: req.body.category,
			seller: req.body.seller,
		});
		product
			.save()
			.then((result) => {
				console.log('Product added successfully:');
				console.log(result);
				res.status(201).json({
					message: 'Product added successfully!',
					product: result,
				});
			})
			.catch((error) => {
				console.log("Product couldn't be added:");
				console.log(error);
				res.status(500).json({
					message: "Product couldn't be added! Please try again.",
				});
			});
	});
};

const getProduct = (req, res, next) => {
	Product.findOne({ _id: req.params.id })
		.then((result) => {
			res.status(200).json({
				message: 'Product fetched successfully!',
				product: result,
			});
		})
		.catch((error) => {
			console.log('Product fetching failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Product couldn't be fetched. Please try again.",
			});
		});
};

const getProducts = async (req, res, next) => {
	let brandFilters = [];
	let sellerFilters = [];
	let categoryFilters = [];
	let sortBy = null;

	for (const key in req.query) {
		if (
			Object.hasOwnProperty.call(req.query, key) &&
			key !== 'pageNum' &&
			key !== 'pageSize'
		) {
			if (key === 'brand') {
				if (Array.isArray(req.query[key])) {
					for (const brand of req.query[key]) {
						let filter = {};
						filter[key] = brand;
						brandFilters.push(filter);
					}
				} else {
					let filter = {};
					filter[key] = req.query[key];
					brandFilters.push(filter);
				}
			}

			if (key === 'seller') {
				if (Array.isArray(req.query[key])) {
					for (const seller of req.query[key]) {
						let filter = {};
						filter[key] = seller;
						sellerFilters.push(filter);
					}
				} else {
					let filter = {};
					filter[key] = req.query[key];
					sellerFilters.push(filter);
				}
			}

			if (key === 'category') {
				if (Array.isArray(req.query[key])) {
					for (const category of req.query[key]) {
						let filter = {};
						filter[key] = category;
						categoryFilters.push(filter);
					}
				} else {
					let filter = {};
					filter[key] = req.query[key];
					categoryFilters.push(filter);
				}
			}

			if (key === 'sort') {
				req.query[key] =
					req.query[key] === 'price' ? 'currentPrice' : req.query[key];
				sortBy = req.query[key];
			}
		}
	}

	let filters = [];
	if (brandFilters.length) {
		filters.push({ $or: brandFilters });
	}
	if (sellerFilters.length) {
		filters.push({ $or: sellerFilters });
	}
	if (categoryFilters.length) {
		filters.push({ $or: categoryFilters });
	}

	const findQuery = filters.length
		? Product.find({ $and: filters }).sort(sortBy)
		: Product.find().sort(sortBy);

	const countQuery = findQuery.clone().countDocuments();

	const pageNum = +req.query.pageNum;
	const pageSize = +req.query.pageSize;
	if (pageNum && pageSize) {
		findQuery.skip(pageSize * (pageNum - 1)).limit(pageSize);
	}

	try {
		const products = await findQuery.exec();
		const totalProducts = await Product.count().exec();
		const filteredProducts = await countQuery.exec();
		const fetchedProducts = products.length;

		res.status(200).json({
			message: 'Products fetched successfully!',
			products: products,
			totalProducts: totalProducts,
			filteredProducts: filteredProducts,
			fetchedProducts: fetchedProducts,
		});
	} catch (error) {
		console.log('Products fetching failed:');
		console.log(error);
		res.status(500).json({
			message: "Sorry! Products couldn't be fetched. Please try again.",
		});
	}
};

const deleteProduct = (req, res, next) => {
	Product.deleteOne({ _id: req.params.id })
		.then((result) => {
			res.status(200).json({
				message: 'Product deleted successfully!',
			});
		})
		.catch((error) => {
			console.log('Product deletion failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Product couldn't be deleted. Please try again.",
			});
		});
};

const getBrands = (req, res, next) => {
	Product.where('brand')
		.ne(null)
		.then((results) => {
			let brands = new Set();
			for (const product of results) {
				brands.add(product.brand);
			}
			res.status(201).json({
				message: 'Brands fetched successfully!',
				brands: [...brands],
				totalBrands: brands.length,
			});
		})
		.catch((error) => {
			console.log('Brands fetching failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Brands couldn't be fetched. Please try again.",
			});
		});
};

const addReview = (req, res, next) => {
	const review = new Review({
		reviewBy: req.body.reviewBy,
		verifiedPurchase: req.body.verifiedPurchase,
		comment: req.body.comment,
		product: req.body.product,
	});

	Product.findById(req.body.product)
		.then((product) => {
			if (!product) {
				return res.status(500).json({
					message: "Review couldn't be added! Please try again.",
				});
			}
			review
				.save()
				.then((result) => {
					product.reviews.push(result._id);
					product.save();
					console.log('Review added successfully:');
					console.log(result);
					res.status(201).json({
						message: 'Review added successfully!',
					});
				})
				.catch((error) => {
					console.log("Review couldn't be added:");
					console.log(error);
					res.status(500).json({
						message: "Review couldn't be added! Please try again.",
					});
				});
		})
		.catch((error) => {
			console.log("Review couldn't be added:");
			console.log(error);
			res.status(500).json({
				message: "Review couldn't be added! Please try again.",
			});
		});
};

const productsControllers = {
	addProduct: addProduct,
	getProduct: getProduct,
	getProducts: getProducts,
	deleteProduct: deleteProduct,
	getBrands: getBrands,
	addReview: addReview,
};

module.exports = productsControllers;
