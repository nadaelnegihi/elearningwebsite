import mongoose, { Document } from 'mongoose';
declare class Question {
    questionText: string;
    options: string[];
    correctAnswer: string;
    difficulty: 'easy' | 'medium' | 'hard';
}
export declare class Quiz extends Document {
    quizId: mongoose.Schema.Types.ObjectId;
    moduleId: mongoose.Schema.Types.ObjectId;
    questions: Question[];
    createdAt: Date;
}
export declare const QuizzesSchema: mongoose.Schema<Quiz, mongoose.Model<Quiz, any, any, any, mongoose.Document<unknown, any, Quiz> & Quiz & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Quiz, mongoose.Document<unknown, {}, mongoose.FlatRecord<Quiz>> & mongoose.FlatRecord<Quiz> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
