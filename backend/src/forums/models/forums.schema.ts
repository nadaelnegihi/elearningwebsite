import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ForumPostDocument = ForumPost & Document;

@Schema({ timestamps: true })
export class ForumPost {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: MongooseSchema.Types.ObjectId; // Reference to the User who created the post

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Comment', default: [] })
  comments: MongooseSchema.Types.ObjectId[]; // Array of comments associated with this post

  @Prop({ default: true })
  isActive: boolean; // To manage soft deletes or deactivation of posts
}

export const ForumPostSchema = SchemaFactory.createForClass(ForumPost);
