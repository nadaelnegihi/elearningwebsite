import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

// Quiz Schema
@Schema()
export class Quiz extends Document {

  @Prop({ required: true })
  moduleId: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Question', required: true })
  questions: mongoose.Types.ObjectId[]; // References to questions from the question bank

  @Prop({ type: Number, required: true })
  numberOfQuestions: number; 

  @Prop({ type: [String], enum: ['MCQ', 'True/False'], required: true })
  questionTypes: string[]; 

  @Prop({ default: Date.now })
  createdAt: Date; // Quiz creation timestamp

  @Prop({ required: true })
  createdBy: mongoose.Schema.Types.ObjectId; 
}

export type QuizDocument = HydratedDocument<Quiz>;
export const QuizzesSchema = SchemaFactory.createForClass(Quiz);
