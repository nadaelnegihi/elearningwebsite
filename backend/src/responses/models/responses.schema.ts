import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

// Answer schema (User's answer to a question)
class Answer {
  @Prop({ type: String, ref: 'Questionbank', required: true })
  questionId: string; // Reference to the Question

  @Prop({ required: true })
  answer: string; // The user's selected answer
}

@Schema()
export class Response extends Document {

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true })
  quizId: mongoose.Types.ObjectId;

  @Prop({ type: [Answer], default: [] })
  answers: Answer[];

  @Prop({ required: true })
  score: number;

  @Prop({ default: Date.now })
  submittedAt: Date;
}

export type ResponseDocument = HydratedDocument<Response>;
export const ResponsesSchema = SchemaFactory.createForClass(Response);