import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the schema for an individual answer object
class Answer {
  @Prop({ required: true })
  questionText: string;  

  @Prop({ required: true })
  answer: string;  
}

@Schema()
export class Response extends Document {
  @Prop({ required: true })
  responseId: string;  

  @Prop({ required: true })
  userId: string;  

  @Prop({ required: true })
  quizId: string;  

  @Prop({ type: [Answer], default: [] })
  answers: Answer[];  

  @Prop({ required: true })
  score: number;  

  @Prop({ default: Date.now })
  submittedAt: Date;  
}

export const ResponsesSchema = SchemaFactory.createForClass(Response);
