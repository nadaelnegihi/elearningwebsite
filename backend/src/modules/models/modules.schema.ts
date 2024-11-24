import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
@Schema()
export class Module extends Document {
  @Prop({ required: true })
  moduleId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  courseId: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  content: string; 

  @Prop({ type: [String], default: [] })
  resources: string[];  

  @Prop({ required: true, default: Date.now })
  createdAt: Date;  
}

export const ModulesSchema = SchemaFactory.createForClass(Module);
