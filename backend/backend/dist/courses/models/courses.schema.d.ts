import mongoose, { Document, HydratedDocument } from 'mongoose';
export type courseDocument = HydratedDocument<Course>;
export declare class Course extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    category: string;
    difficulty_level: string;
    created_by: mongoose.Types.ObjectId;
    createdAt: Date;
}
export declare const CoursesSchema: mongoose.Schema<Course, mongoose.Model<Course, any, any, any, mongoose.Document<unknown, any, Course> & Course & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Course, mongoose.Document<unknown, {}, mongoose.FlatRecord<Course>> & mongoose.FlatRecord<Course> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
