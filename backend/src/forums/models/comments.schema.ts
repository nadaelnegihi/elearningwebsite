import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: MongooseSchema.Types.ObjectId; // Reference to the User who made the comment

  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'ForumPost' })
  forumPost: MongooseSchema.Types.ObjectId; // Reference to the parent ForumPost

  @Prop({ default: true })
  isActive: boolean; // To manage soft deletes or deactivation of comments
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
