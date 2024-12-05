import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/CreateQuizDto';
import { CreateQuestionDto } from './dto/CreateQuestionDto';
import { Questionbank } from './models/questionbank.schema';
export declare class QuizzesController {
    private quizService;
    constructor(quizService: QuizzesService);
    createQuestion(createQuestionDto: CreateQuestionDto): Promise<Questionbank>;
    createQuiz(createQuizDto: CreateQuizDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/quizzes.schema").Quiz> & import("./models/quizzes.schema").Quiz & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, import("./models/quizzes.schema").Quiz> & import("./models/quizzes.schema").Quiz & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
