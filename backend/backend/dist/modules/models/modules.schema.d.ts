import mongoose, { HydratedDocument } from 'mongoose';
export type ModuleDocument = HydratedDocument<Module>;
export declare class Module {
    courseId: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    difficulty_level: string;
    resources: {
        contentType: string;
        resource: string;
    }[];
    createdAt: Date;
    versions: Array<{
        title: string;
        content: string;
        hierarchy: {
            contentType: string;
            resource: string;
        }[];
        updatedAt: Date;
    }>;
    isOutdated: boolean;
    quizzes: mongoose.Types.ObjectId[];
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
