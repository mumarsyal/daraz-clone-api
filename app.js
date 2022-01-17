const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users.routes');

const app = express();

const MONGO_ATLAS_DB = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.8boni.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

mongoose
	.connect(MONGO_ATLAS_DB)
	.then(() => {
		console.log('Database Connection Successful!');
	})
	.catch((err) => {
		console.log('Database Connection Failed!');
		console.log(err);
	});

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, PUT, DELETE, OPTIONS'
	);
	next();
});

app.use('/api/users', usersRoutes);

module.exports = app;
