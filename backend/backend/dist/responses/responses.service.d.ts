import mongoose from 'mongoose';
import { ResponseDocument } from './models/responses.schema';
import { SubmitQuizDto } from './dto/SubmitQuizDto';
import { QuestionDocument } from 'src/quizzes/models/questionbank.schema';
import { UserDocument } from 'src/users/models/users.schema';
export declare class ResponsesService {
    private ResponseModel;
    private questionModel;
    private userModel;
    constructor(ResponseModel: mongoose.Model<ResponseDocument>, questionModel: mongoose.Model<QuestionDocument>, userModel: mongoose.Model<UserDocument>);
    submitQuiz(submitQuizDto: SubmitQuizDto): Promise<{
        percentage: number;
        feedback: string;
    }>;
}
