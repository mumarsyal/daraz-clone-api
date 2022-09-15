const request = require('supertest');

const baseURL = 'https://daraz-hazelsoft.herokuapp.com/api';

describe('Sellers', () => {
	const seller = {
		'name': 'Jest Seller',
	};

	test('should add an item to sellers table', async () => {
		const response = await request(baseURL)
			.post('/sellers')
			.send(seller);
		expect(response.statusCode).toBe(201);
		expect(response.body.message).toBe('Seller added successfully!');
	});

	test('should get an item from sellers table', async () => {
		const response = await request(baseURL)
			.get('/sellers/61ebd4771711fc332487eef6')
			.send();
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe('Seller fetched successfully!');
		expect(response.body.seller).not.toBeNull();
	});

	test('should get all items from sellers table', async () => {
		const response = await request(baseURL)
			.get('/sellers')
			.send();
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe('Sellers fetched successfully!');
		expect(response.body.sellers).not.toBeNull();
		expect(response.body.totalSellers).not.toBeNull();
	});
});
