const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.signup = (req, res, next) => {
	if (!emailValidator.validate(req.body.email)) {
		return res.status(422).json({
			message: 'Invalid Email Format. Email must be as "a@a.aa"',
			errorField: 'Email'
		});
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(409).json({
				message: 'Email already exists',
				errorField: 'Email'
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
						errorField: 'Form'
					});
				});
		});
	});
};

exports.login = (req, res, next) => {
	let fetchedUser;

	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(404).json({
					message: 'Email not found!',
				});
			}
			fetchedUser = user;
			return bcrypt.compare(req.body.password, user.password);
		})
		.then((passwordMatched) => {
			if (!passwordMatched) {
				return res.status(401).json({
					message: 'Invalid password!',
				});
			}
			const token = jwt.sign(
				{ email: fetchedUser.email, userId: fetchedUser._id },
				process.env.JWT_SECRET_KEY,
				{ expiresIn: '1h' }
			);
			res.status(200).json({
				message: 'Logged In',
				token: token,
				expiresIn: 3600000, // 1 hour in milliseconds
				userId: fetchedUser._id,
			});
		})
		.catch((err) => {
			console.log('error');
			console.log(err);
			res.status(500).json({
				message: 'Sorry! An unknown error occured while logging in!',
			});
		});
};
