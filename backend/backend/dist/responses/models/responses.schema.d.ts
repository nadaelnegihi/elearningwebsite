import mongoose, { Document } from 'mongoose';
declare class Answer {
    questionText: string;
    answer: string;
}
export declare class Response extends Document {
    responseId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    quizId: mongoose.Schema.Types.ObjectId;
    answers: Answer[];
    score: number;
    submittedAt: Date;
}
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
