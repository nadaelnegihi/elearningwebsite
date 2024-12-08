import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
export type ProgressDocument = HydratedDocument<Progress>;
@Schema({ collection: 'progresses' })
export class Progress extends Document {

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' })
  courseId: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true, default:0})
  completionPercentage: number;  

  @Prop({ required: true, default: Date.now })
  lastAccessed: Date;  

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }], default: [] })
  completedModules: mongoose.Types.ObjectId[];

}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
