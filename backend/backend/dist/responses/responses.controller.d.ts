import { ResponsesService } from './responses.service';
import { SubmitQuizDto } from './dto/SubmitQuizDto';
export declare class ResponsesController {
    private readonly responsesService;
    constructor(responsesService: ResponsesService);
    submitQuiz(submitQuizDto: SubmitQuizDto): Promise<{
        percentage: number;
        feedback: string;
    }>;
}
