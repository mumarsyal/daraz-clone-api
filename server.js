require('dotenv').config();
const http = require('http');

const app = require('./app');

const normalizePort = (val) => {
	const normalizedPort = parseInt(val, 10);

	if (Number.isNaN(normalizedPort)) {
		// named pipe
		return val;
	}

	if (normalizedPort >= 0) {
		// port number
		return normalizedPort;
	}

	return false;
};

const port = normalizePort(process.env.PORT || '3000');

const onError = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const bind = typeof port === 'string' ? `pipe ${port}` : `port ${port}`;
	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = http.createServer(app);

const onListening = () => {
	console.log(`Listening on http://127.0.0.1:${port}/`);
};

app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
