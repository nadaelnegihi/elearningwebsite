import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Conversation {
  @Prop({ required: true, unique: true })
  id: string;  // Unique identifier for the conversation

  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  participants: mongoose.Types.ObjectId[];  // Participants in the conversation

  @Prop({ required: true, default: Date.now })
  createdAt: Date;  // Timestamp when the conversation was created
}

export type ConversationDocument = HydratedDocument<Conversation>;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
