import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResourceDocument = HydratedDocument<Resource> & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  contentType: string; // e.g., video, pdf, image

  @Prop({ required: true })
  resourcePath: string; // File path or URL to the resource

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
  moduleId: mongoose.Types.ObjectId;

  @Prop({ default: false })
  completed: boolean; // Flag to indicate if the resource has been completed by the student
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
