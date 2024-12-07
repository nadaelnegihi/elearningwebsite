import mongoose, { Document } from 'mongoose';
export type ThreadDocument = Thread & Document;
export declare class Thread {
    title: string;
    content: string;
    createdBy: mongoose.Types.ObjectId;
    forumId: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
}
export declare const ThreadSchema: mongoose.Schema<Thread, mongoose.Model<Thread, any, any, any, mongoose.Document<unknown, any, Thread> & Thread & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Thread, mongoose.Document<unknown, {}, mongoose.FlatRecord<Thread>> & mongoose.FlatRecord<Thread> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
