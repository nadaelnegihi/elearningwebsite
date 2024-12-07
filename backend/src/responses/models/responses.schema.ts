import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

// Answer schema (User's answer to a question)
class Answer {
  @Prop({ required: true })
  questionId: mongoose.Schema.Types.ObjectId; // Reference to the Question

  @Prop({ required: true })
  answer: string; // The user's selected answer
}

@Schema()
export class Response extends Document {

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

export type ResponseDocument = HydratedDocument<Response>;
export const ResponsesSchema = SchemaFactory.createForClass(Response);