import mongoose, { Document, HydratedDocument } from 'mongoose';
export type ProgressDocument = HydratedDocument<Progress>;
export declare class Progress extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    courseId: mongoose.Schema.Types.ObjectId;
    completionPercentage: number;
    lastAccessed: Date;
    completedModules: mongoose.Schema.Types.ObjectId[];
}
export declare const ProgressSchema: mongoose.Schema<Progress, mongoose.Model<Progress, any, any, any, mongoose.Document<unknown, any, Progress> & Progress & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Progress, mongoose.Document<unknown, {}, mongoose.FlatRecord<Progress>> & mongoose.FlatRecord<Progress> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
