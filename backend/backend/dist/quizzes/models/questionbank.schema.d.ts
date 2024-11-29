import mongoose, { Document, HydratedDocument } from 'mongoose';
export declare class Questionbank extends Document {
    questionText: string;
    options: string[];
    correctAnswer: string;
    difficulty: 'easy' | 'medium' | 'hard';
}
export type QuestionDocument = HydratedDocument<Questionbank>;
export declare const QuestionbankSchema: mongoose.Schema<Questionbank, mongoose.Model<Questionbank, any, any, any, mongoose.Document<unknown, any, Questionbank> & Questionbank & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Questionbank, mongoose.Document<unknown, {}, mongoose.FlatRecord<Questionbank>> & mongoose.FlatRecord<Questionbank> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
