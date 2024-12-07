import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ReplyDocument = Reply & Document;

@Schema({ timestamps: true })
export class Reply {
  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true })
  threadId: mongoose.Types.ObjectId;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
