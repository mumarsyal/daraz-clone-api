const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users.routes');
const categoriesRoutes = require('./routes/categories.routes');
const sellersRoutes = require('./routes/sellers.routes');
const productsRoutes = require('./routes/products.routes');

const app = express();
app.disable('x-powered-by');

const MONGO_ATLAS_DB = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}
					@cluster0.8boni.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

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

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'localhost:8088');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, PUT, DELETE, OPTIONS',
	);
	next();
});

app.use('/api/users', usersRoutes);

app.use('/api/categories', categoriesRoutes);

app.use('/api/sellers', sellersRoutes);

app.use('/api/products', productsRoutes);

module.exports = app;
