import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class ChatMessage {
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: mongoose.Schema.Types.ObjectId;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiver: mongoose.Schema.Types.ObjectId;

  @Prop({ required: false })
  content: string;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop({ required: false })
  conversationId: string;

  @Prop({ default: true }) 
  isActive: boolean;

  @Prop({ default: false })
  isGroupChat: boolean;

  @Prop({ required: function () { return this.isGroupChat; } })
  groupName?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: function () { return this.isGroupChat; } })
  participants?: mongoose.Types.ObjectId[];

}

export type ChatMessageDocument = HydratedDocument<ChatMessage>;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
