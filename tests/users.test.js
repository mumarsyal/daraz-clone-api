const request = require('supertest');

const baseURL = 'http://localhost:3000/api/users';

describe('Users', () => {
	const correctUser = {
		'email': 'a@a.aa',
		'password': '1234',
	};
	const wrongEmail = {
		'email': 'a@a.aaaaaaaa',
		'password': '1234',
	};
	const wrongPass = {
		'email': 'a@a.aa',
		'password': '1234333333333',
	};

	test('should successfully login a user', async () => {
		const response = await request(baseURL)
			.post('/login')
			.send(correctUser);
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe('Logged In');
		expect(response.body.token).not.toBeNull();
	});

	test('should say email not found', async () => {
		const response = await request(baseURL)
			.post('/login')
			.send(wrongEmail);
		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe('Email not found!');
	});

	test('should say password incorrect', async () => {
		const response = await request(baseURL)
			.post('/login')
			.send(wrongPass);
		expect(response.statusCode).toBe(401);
		expect(response.body.message).toBe('Invalid password!');
	});

	test('should say unknown error', async () => {
		const response = await request(baseURL)
			.post('/login')
			.send();
		expect(response.statusCode).toBe(500);
		expect(response.body.message).toBe('Sorry! An unknown error occured while logging in!');
	});
});
