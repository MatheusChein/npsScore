import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveyController {
	async create(request: Request, response: Response) {

		const surveysRepository = getCustomRepository(SurveysRepository);

		const { title, description } = request.body;

		const survey = surveysRepository.create({
			title,
			description
		});

		await surveysRepository.save(survey);

		return response.status(201).json(survey);
	}

	async show(request: Request, response: Response) {
		const surveysRepository = getCustomRepository(SurveysRepository);
		
		const allSurveys = await surveysRepository.find();

		return response.status(200).json(allSurveys);
	}
}

export { SurveyController }