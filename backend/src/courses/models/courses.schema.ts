import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course extends Document {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string; // Math, CS, Science...

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_level: string;

  @Prop({ required: true })
  created_by: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }] })
  modules: mongoose.Types.ObjectId[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: [Number], default: [] }) 
  ratings: number[];

  @Prop({ required: true, default: true }) // Default to available
  isAvailable: boolean;

  @Prop({ type: [String], default: [] }) // Add keywords field
  keywords: string[];
}

export const CoursesSchema = SchemaFactory.createForClass(Course);
