import { Request, Response } from "express";
import path from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";


class SendMailController {
	async execute(request: Request, response: Response)	{
		const { email, survey_id } = request.body;

		const usersRepository = getCustomRepository(UsersRepository);
		const surveysRepository = getCustomRepository(SurveysRepository);
		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

		const userExists = await usersRepository.findOne({
			email
		});

		if (!userExists) {
			throw new AppError("User does not exist");
		}

		const surveyExists = await surveysRepository.findOne({
			id: survey_id
		});

		if (!surveyExists) {
			throw new AppError("Survey does not exist");
		}

		const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
			where: { 
				user_id: userExists.id, 
				value: null 
			},
			relations: ["user", "survey"]
		});

		const variables = {
			name: userExists.name,
			title: surveyExists.title,
			description: surveyExists.description,
			id: '',
			link: process.env.URL_MAIL
		}

		const npsPath = path.resolve(__dirname, "..", "views", "emails", "npsMail.hbs");


		if (surveyUserAlreadyExists) {
			variables.id = surveyUserAlreadyExists.id;
			await SendMailService.execute(email, surveyExists.title, variables, npsPath)
			return response.json(surveyUserAlreadyExists)
		}

		const surveyUser = surveysUsersRepository.create({
			survey_id,
			user_id: userExists.id,
		});

		await surveysUsersRepository.save(surveyUser);

		variables.id = surveyUser.id;

		await SendMailService.execute(email, surveyExists.title, variables, npsPath);

		return response.json(surveyUser)
	}
}

export { SendMailController };
