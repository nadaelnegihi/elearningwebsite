import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

// Question Schema for the Question Bank
@Schema()
export class Questionbank extends Document {
  @Prop({ required: true })
  questionId :string; 

  @Prop({ required: true })
  moduleId: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true })
  options: string[]; 

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' })
  difficulty: 'easy' | 'medium' | 'hard'; 

  @Prop({ type: String, enum: ['MCQ', 'True/False'], required: true })
  questionTypes: string;
}

export type QuestionDocument = HydratedDocument<Questionbank>;
export const QuestionbankSchema = SchemaFactory.createForClass(Questionbank);
