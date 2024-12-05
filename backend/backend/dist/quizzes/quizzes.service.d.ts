import mongoose, { Model } from 'mongoose';
import { Quiz } from './models/quizzes.schema';
import { CreateQuizDto } from './dto/CreateQuizDto';
import { Questionbank, QuestionDocument } from './models/questionbank.schema';
import { QuizDocument } from './models/quizzes.schema';
import { CreateQuestionDto } from './dto/CreateQuestionDto';
import { UserDocument } from 'src/users/models/users.schema';
export declare class QuizzesService {
    private questionModel;
    private quizModel;
    private userModel;
    constructor(questionModel: mongoose.Model<QuestionDocument>, quizModel: Model<QuizDocument>, userModel: Model<UserDocument>);
    createQuestion(createQuestionDto: CreateQuestionDto): Promise<Questionbank>;
    createQuiz(createQuizDto: CreateQuizDto): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Quiz> & Quiz & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }> & mongoose.Document<unknown, {}, Quiz> & Quiz & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    generateQuestions(studentId: string, quizId: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Quiz> & Quiz & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }> & mongoose.Document<unknown, {}, Quiz> & Quiz & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    private mapPerformanceToDifficulty;
}
