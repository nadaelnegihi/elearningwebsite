import mongoose, { Document, HydratedDocument } from 'mongoose';
export declare class Quiz extends Document {
    quizId: string;
    moduleId: mongoose.Schema.Types.ObjectId;
    questions: string[];
    numberOfQuestions: number;
    questionTypes: string[];
    createdAt: Date;
    createdBy: mongoose.Schema.Types.ObjectId;
}
export type QuizDocument = HydratedDocument<Quiz>;
export declare const QuizzesSchema: mongoose.Schema<Quiz, mongoose.Model<Quiz, any, any, any, mongoose.Document<unknown, any, Quiz> & Quiz & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Quiz, mongoose.Document<unknown, {}, mongoose.FlatRecord<Quiz>> & mongoose.FlatRecord<Quiz> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
