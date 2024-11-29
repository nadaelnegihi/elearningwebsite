import mongoose, { Document, HydratedDocument } from 'mongoose';
export type NoteDocument = HydratedDocument<Note>;
export declare class Note extends Document {
    noteId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    courseId?: mongoose.Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
    lastUpdated: Date;
}
export declare const NotesSchema: mongoose.Schema<Note, mongoose.Model<Note, any, any, any, mongoose.Document<unknown, any, Note> & Note & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Note, mongoose.Document<unknown, {}, mongoose.FlatRecord<Note>> & mongoose.FlatRecord<Note> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
