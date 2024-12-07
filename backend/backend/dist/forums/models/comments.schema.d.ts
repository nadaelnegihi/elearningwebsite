import { Document, Schema as MongooseSchema } from 'mongoose';
export type CommentDocument = Comment & Document;
export declare class Comment {
    content: string;
    author: MongooseSchema.Types.ObjectId;
    timestamp: Date;
    forumPost: MongooseSchema.Types.ObjectId;
    isActive: boolean;
}
export declare const CommentSchema: MongooseSchema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment> & Comment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>> & import("mongoose").FlatRecord<Comment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
