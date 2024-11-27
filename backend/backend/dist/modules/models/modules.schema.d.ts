import mongoose, { Document } from 'mongoose';
export declare class Module extends Document {
    moduleId: mongoose.Schema.Types.ObjectId;
    courseId: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    resources: string[];
    createdAt: Date;
}
export declare const ModulesSchema: mongoose.Schema<Module, mongoose.Model<Module, any, any, any, mongoose.Document<unknown, any, Module> & Module & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Module, mongoose.Document<unknown, {}, mongoose.FlatRecord<Module>> & mongoose.FlatRecord<Module> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
