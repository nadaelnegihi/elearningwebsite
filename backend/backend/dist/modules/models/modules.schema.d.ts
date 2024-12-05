import mongoose, { HydratedDocument } from 'mongoose';
export type ModuleDocument = HydratedDocument<Module> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class Module {
    courseId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    difficulty_level: string;
    resources: mongoose.Types.ObjectId[];
    versions: Array<{
        title: string;
        content: string;
        resources: {
            contentType: string;
            resource: string;
            date: Date;
        }[];
        updatedAt: Date;
    }>;
    isOutdated: boolean;
    quizzes: mongoose.Types.ObjectId[];
    questions: mongoose.Types.ObjectId[];
}
export declare const ModulesSchema: mongoose.Schema<Module, mongoose.Model<Module, any, any, any, mongoose.Document<unknown, any, Module> & Module & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Module, mongoose.Document<unknown, {}, mongoose.FlatRecord<Module>> & mongoose.FlatRecord<Module> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
