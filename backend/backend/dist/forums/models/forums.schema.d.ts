import { Document, Schema as MongooseSchema } from 'mongoose';
export type ForumPostDocument = ForumPost & Document;
export declare class ForumPost {
    title: string;
    content: string;
    timestamp: Date;
    author: MongooseSchema.Types.ObjectId;
    comments: MongooseSchema.Types.ObjectId[];
    isActive: boolean;
}
export declare const ForumPostSchema: MongooseSchema<ForumPost, import("mongoose").Model<ForumPost, any, any, any, Document<unknown, any, ForumPost> & ForumPost & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ForumPost, Document<unknown, {}, import("mongoose").FlatRecord<ForumPost>> & import("mongoose").FlatRecord<ForumPost> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
