import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
@Schema()
export class Course extends Document {

  @Prop({ required: true })
  courseId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;  

  @Prop({ required: true })
  description: string;  

  @Prop({ required: true })
  category: string;  //Math , CS, Science...

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_level: string; 

  @Prop({ required: true })
  created_by: string;  

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

}

export const CoursesSchema = SchemaFactory.createForClass(Course);
