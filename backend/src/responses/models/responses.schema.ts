import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document,HydratedDocument } from 'mongoose';

// Define the schema for an individual answer object
class Answer {
  @Prop({ required: true })
  questionText: string;  

  @Prop({ required: true })
  answer: string;  
}

@Schema()
export class Response extends Document {
  @Prop({ required: true,unique: true })
  responseId: mongoose.Schema.Types.ObjectId;  

  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true })
  quizId: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: [Answer], default: [] })
  answers: Answer[];  

  @Prop({ required: true })
  score: number;  

  @Prop({ default: Date.now })
  submittedAt: Date;  
}

export const ResponsesSchema = SchemaFactory.createForClass(Response);
