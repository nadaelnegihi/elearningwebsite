import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Question {
  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true })
  options: string[]; 

  @Prop({ required: true })
  correctAnswer: string; 

  @Prop({ type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' })
  difficulty: 'easy' | 'medium' | 'hard'; 
}

@Schema()
export class Quiz extends Document {
  @Prop({ required: true })
  quizId: string; 

  @Prop({ required: true })
  moduleId: string; 

  @Prop({ type: [Question], required: true })
  questions: Question[]; 

  @Prop({ default: Date.now })
  createdAt: Date; 
}

export const QuizzesSchema = SchemaFactory.createForClass(Quiz);
