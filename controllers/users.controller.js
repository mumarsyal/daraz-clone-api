const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.signup = (req, res, next) => {
	if (!req.body.email.match('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')) {
		return res.status(422).json({
			message: 'Invalid Email Format. Email must be as "john@doe.com"',
			errorField: 'Email',
		});
	}

	if (!req.body.firstName) {
		return res.status(422).json({
			message: 'First name is required',
			errorField: 'FirstName',
		});
	}

	if (!req.body.lastName) {
		return res.status(422).json({
			message: 'Last name is required',
			errorField: 'LastName',
		});
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(409).json({
				message: 'Email already exists',
				errorField: 'Email',
			});
		}

		bcrypt.hash(req.body.password, 10).then((passwordHash) => {
			const user = new User({
				email: req.body.email,
				password: passwordHash,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
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
						errorField: 'Form',
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
					errorField: 'Email',
				});
			}
			fetchedUser = user;
			return bcrypt.compare(req.body.password, user.password);
		})
		.then((passwordMatched) => {
			if (!fetchedUser) {
				// when no user exists with provided email, response from above
				// 'then' block gets returned to this block which causes error
				// because of no fetchedUser, to avoid that, just return
				return;
			}
			if (!passwordMatched) {
				return res.status(401).json({
					message: 'Invalid password!',
					errorField: 'Password',
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
				errorField: 'Form',
			});
		});
};
