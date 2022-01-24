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
	let filters = [];
	for (const key in req.query) {
		if (
			Object.hasOwnProperty.call(req.query, key) &&
			key !== 'pageNum' &&
			key !== 'pageSize'
		) {
			let filter = {};
			filter[key] = req.query[key];
			filters.push(filter);
		}
	}

	const query = filters.length
		? Product.find({ $or: filters })
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

const productsControllers = {
	addProduct: addProduct,
	getProduct: getProduct,
	getProducts: getProducts,
	deleteProduct: deleteProduct,
};

module.exports = productsControllers;
