import mongoose, { Document, HydratedDocument } from 'mongoose';
declare class Answer {
    questionId: mongoose.Schema.Types.ObjectId;
    answer: string;
}
export declare class Response extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    quizId: mongoose.Schema.Types.ObjectId;
    answers: Answer[];
    score: number;
    submittedAt: Date;
}
export type ResponseDocument = HydratedDocument<Response>;
export declare const ResponsesSchema: mongoose.Schema<Response, mongoose.Model<Response, any, any, any, mongoose.Document<unknown, any, Response> & Response & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Response, mongoose.Document<unknown, {}, mongoose.FlatRecord<Response>> & mongoose.FlatRecord<Response> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
