import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
export type NoteDocument = HydratedDocument<Note>;
@Schema()
export class Note extends Document {
  @Prop({ required: true })
  noteId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: false })
  courseId?: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date; 

  @Prop({ default: Date.now })
  lastUpdated: Date; 
}

export const NotesSchema = SchemaFactory.createForClass(Note);
