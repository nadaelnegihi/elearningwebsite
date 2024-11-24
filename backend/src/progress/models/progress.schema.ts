import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

@Schema()
export class Progress extends Document {
  @Prop({ required: true })
  progressId: mongoose.Schema.Types.ObjectId;  

  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;   

  @Prop({ required: true })
  courseId: mongoose.Schema.Types.ObjectId;  

  @Prop({ required: true })
  completionPercentage: number;  

  @Prop({ required: true, default: Date.now })
  lastAccessed: Date;  
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
