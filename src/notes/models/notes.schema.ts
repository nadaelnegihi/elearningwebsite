import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Note extends Document {
  @Prop({ required: true })
  noteId: string; 

  @Prop({ required: true })
  userId: string; 

  @Prop({ required: false })
  courseId?: string; 

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date; 

  @Prop({ default: Date.now })
  lastUpdated: Date; 
}

export const NotesSchema = SchemaFactory.createForClass(Note);
