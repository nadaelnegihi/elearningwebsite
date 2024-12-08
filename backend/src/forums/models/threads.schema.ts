import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ThreadDocument = Thread & Document;

@Schema({ timestamps: true })
export class Thread {
  @Prop({ required: false })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: false })
  forumId: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }] })
  replies: mongoose.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true })
  threadId: mongoose.Types.ObjectId;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
