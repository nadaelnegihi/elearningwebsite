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

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: MongooseSchema.Types.ObjectId; // Reference to the User who created the post

  @Prop({
    type: [
      {
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        author: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
      },
    ],
    default: [],
  })
  comments: {
    content: string;
    timestamp: Date;
    author: MongooseSchema.Types.ObjectId;
  }[]; // Embedded comments directly in the ForumPost document

  @Prop({ default: true })
  isActive: boolean; // To manage soft deletes or deactivation of posts

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'ForumPost' })
  forumPost: MongooseSchema.Types.ObjectId; // Reference to the parent ForumPost
}

export const ForumPostSchema = SchemaFactory.createForClass(ForumPost);

