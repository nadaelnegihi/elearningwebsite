import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Module extends Document {
  @Prop({ required: true })
  moduleId: string; 

  @Prop({ required: true })
  courseId: string;  

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
