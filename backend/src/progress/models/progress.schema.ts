import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
export type ProgressDocument = HydratedDocument<Progress>;
@Schema()
export class Progress extends Document {

  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;   

  @Prop({ required: true })
  courseId: mongoose.Schema.Types.ObjectId;  

  @Prop({ required: true, default:0})
  completionPercentage: number;  

  @Prop({ required: true, default: Date.now })
  lastAccessed: Date;  

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }], default: [] })
  completedModules: mongoose.Schema.Types.ObjectId[];

}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
