import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';

describe("Surveys", () => {
	beforeAll(async () => {
		const connection  = await createConnection();
		await connection.runMigrations()
	});

	afterAll(async () => {
		const connection = getConnection();
		await connection.dropDatabase();
		await connection.close();
	});

	it("should be able to create a new survey", async () => {
		const response = await request(app).post('/surveys').send({
			title: "Pesquisa de Satisfação",
			description: "Satisfação é o carai"
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("id");
	});

	it("should be able to list all surveys", async () => {
		await request(app).post('/surveys').send({
			title: "Pesquisa de Satisfação2",
			description: "Satisfação é o carai2"
		});

		const response = await request(app).get('/surveys')

		expect(response.body.length).toBe(2);
	})
});