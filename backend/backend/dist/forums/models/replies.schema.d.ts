import mongoose, { Document } from 'mongoose';
export type ReplyDocument = Reply & Document;
export declare class Reply {
    content: string;
    createdBy: mongoose.Types.ObjectId;
    threadId: mongoose.Types.ObjectId;
}
export declare const ReplySchema: mongoose.Schema<Reply, mongoose.Model<Reply, any, any, any, mongoose.Document<unknown, any, Reply> & Reply & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Reply, mongoose.Document<unknown, {}, mongoose.FlatRecord<Reply>> & mongoose.FlatRecord<Reply> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
