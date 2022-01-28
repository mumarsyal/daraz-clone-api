const multer = require('multer');

const Product = require('../models/product.model');
const fileUploadMiddleware = require('../middlewares/fileUpload.middleware');

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

		const product = new Product({
			title: req.body.title,
			thumbnail: `${url}/${process.env.IMAGE_UPLOADS_FOLDER}/${req.files[0].filename}`,
			brand: req.body.brand,
			currentPrice: req.body.currentPrice,
			oldPrice: req.body.oldPrice,
			colors: req.body.colors,
			features: req.body.features,
			images: images,
			sku: req.body.sku,
			model: req.body.model,
			material: req.body.material,
			inTheBox: req.body.inTheBox,
			category: req.body.categoryId,
			seller: req.body.sellerId,
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

const getProducts = (req, res, next) => {
	let brandFilters = [];
	let sellerFilters = [];
	let categoryFilters = [];

	for (const key in req.query) {
		if (
			Object.hasOwnProperty.call(req.query, key) &&
			key !== 'pageNum' &&
			key !== 'pageSize'
		) {
			let filter = {};
			filter[key] = req.query[key];

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

	const query = filters.length
		? Product.find({ $and: filters })
		: Product.find();

	const pageNum = +req.query.pageNum;
	const pageSize = +req.query.pageSize;
	if (pageNum && pageSize) {
		query.skip(pageSize * (pageNum - 1)).limit(pageSize);
	}

	let products;

	query
		.then((results) => {
			products = results;
			return Product.count();
		})
		.then((count) => {
			res.status(200).json({
				message: 'Products fetched successfully!',
				products: products,
				totalProducts: count,
				fetchedProducts: products.length,
			});
		})
		.catch((error) => {
			console.log('Products fetching failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Products couldn't be fetched. Please try again.",
			});
		});
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
			let brands = [];
			for (const product of results) {
				brands.push(product.brand);
			}
			res.status(201).json({
				message: 'Brands fetched successfully!',
				brands: brands,
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

const productsControllers = {
	addProduct: addProduct,
	getProduct: getProduct,
	getProducts: getProducts,
	deleteProduct: deleteProduct,
	getBrands: getBrands,
};

module.exports = productsControllers;
