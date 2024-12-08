import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

// Quiz Schema
@Schema()
export class Quiz extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
  moduleId: mongoose.Types.ObjectId; 

  @Prop({ type: [String], ref: 'Question', required: true })
  questions: string[]; // References to questions from the question bank

  @Prop({ type: Number, required: true })
  numberOfQuestions: number; 

  @Prop({ type: [String], enum: ['MCQ', 'True/False','Both'], required: true })
  questionTypes: string[]; 

  @Prop({ default: Date.now })
  createdAt: Date; // Quiz creation timestamp

  @Prop({ type: String, ref: 'User', required: true }) 
  createdBy: string;
}

export type QuizDocument = HydratedDocument<Quiz>;
export const QuizzesSchema = SchemaFactory.createForClass(Quiz);

