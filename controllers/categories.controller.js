const multer = require('multer');

const Category = require('../models/category.model');
const fileUploadMiddleware = require('../middlewares/fileUpload.middleware');

const addCategory = (req, res, next) => {
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
		const category = new Category({
			title: req.body.title,
			imagePath: `${url}/${process.env.IMAGE_UPLOADS_FOLDER}/${req.file.filename}`,
		});
		category
			.save()
			.then((result) => {
				console.log('Category added successfully:');
				console.log(result);
				res.status(201).json({
					message: 'Category added successfully!',
				});
			})
			.catch((error) => {
				console.log("Category couldn't be added:");
				console.log(error);
				res.status(500).json({
					message: "Category couldn't be added! Please try again.",
				});
			});
	});
};

const getCategory = (req, res, next) => {
	Category.findOne({ _id: req.params.id })
		.then((result) => {
			console.log('Category fetched successfully:');
			console.log(result);
			res.status(200).json({
				message: 'Category fetched successfully!',
				category: result,
			});
		})
		.catch((error) => {
			console.log('Category fetching failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Category couldn't be fetched. Please try again.",
			});
		});
};

const getCategories = (req, res, next) => {
	const limit = +req.query.limit;
	const query = Category.find();
	let categories;

	if (limit) {
		query.limit(limit);
	}

	query
		.then((results) => {
			categories = results;
			return Category.count();
		})
		.then((count) => {
			res.status(200).json({
				message: 'Categories fetched successfully!',
				categories: categories,
				totalCategories: count,
			});
		})
		.catch((error) => {
			console.log('Categories fetching failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Categories couldn't be fetched. Please try again.",
			});
		});
};

const deleteCategory = (req, res, next) => {
	Category.deleteOne({ _id: req.params.id })
		.then((result) => {
			res.status(200).json({
				message: 'Category deleted successfully!',
			});
		})
		.catch((error) => {
			console.log('Category deletion failed:');
			console.log(error);
			res.status(500).json({
				message: "Sorry! Category couldn't be deleted. Please try again.",
			});
		});
};

const categoriesControllers = {
	addCategory: addCategory,
	getCategory: getCategory,
	getCategories: getCategories,
	deleteCategory: deleteCategory,
};

module.exports = categoriesControllers;
