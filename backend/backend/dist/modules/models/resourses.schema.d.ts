import mongoose, { HydratedDocument } from 'mongoose';
export type ResourceDocument = HydratedDocument<Resource> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class Resource {
    title: string;
    contentType: string;
    resourcePath: string;
    moduleId: mongoose.Types.ObjectId;
    completed: boolean;
}
export declare const ResourceSchema: mongoose.Schema<Resource, mongoose.Model<Resource, any, any, any, mongoose.Document<unknown, any, Resource> & Resource & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Resource, mongoose.Document<unknown, {}, mongoose.FlatRecord<Resource>> & mongoose.FlatRecord<Resource> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
