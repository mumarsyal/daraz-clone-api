const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');

const User = require('../models/user.model');

exports.signup = (req, res, next) => {
	if (!emailValidator.validate(req.body.email)) {
		return res.status(422).json({
			message: 'Invalid Email Format. Email must be as "a@a.aa"',
		});
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(409).json({
				message: 'Email already exists',
			});
		}

		bcrypt.hash(req.body.password, 10).then((passwordHash) => {
			const user = new User({
				email: req.body.email,
				password: passwordHash,
			});
			user.save()
				.then((user) => {
					res.status(201).json({
						message: 'Congratulations! Account created!',
					});
				})
				.catch((err) => {
					res.status(500).json({
						message: 'Sorry! User could not be created!',
					});
				});
		});
	});
};
