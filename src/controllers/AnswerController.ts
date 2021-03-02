import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {

	// http://localhost:3333/answers/1?u=0c8c6eae-cf04-49f9-8e99-7fd28f372851

	async execute(request: Request, response: Response) {
		const { value } = request.params;
		const { u } = request.query;

		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

		const surveyUser = await surveysUsersRepository.findOne({
			id: String(u)
		});

		if (!surveyUser) {
			throw new AppError("Survey User does not exist");
		}

			surveyUser.value = Number(value);

			await surveysUsersRepository.save(surveyUser);

			return response.json(surveyUser);
	}
}

export { AnswerController };
