import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {HydratedDocument } from 'mongoose';
export type ModuleDocument = HydratedDocument<Module>;
@Schema()
export class Module {

  @Prop({ required: true })
  courseId: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  content: string; 

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_level: string;

  @Prop({
    type: [{
      contentType: { type: String, enum: ['video', 'pdf', 'image'], required: true },
      resource: { type: String, required: true }, 
    }],
    default: [],
  })
  resources: { contentType: string; resource: string }[]; 

  @Prop({ required: true, default: Date.now })
  createdAt: Date;  

  @Prop({
    type: [{
      title: String,
      content: String,
      hierarchy: [{ contentType: String, resource: String }],
      updatedAt: { type: Date, default: Date.now },
    }],
    default: [],
  })
  versions: Array<{
    title: string;
    content: string;
    hierarchy: { contentType: string; resource: string }[];
    updatedAt: Date;
  }>;

  @Prop({ default: false })
  isOutdated: boolean;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }] })
  quizzes: mongoose.Types.ObjectId[]; 
}

export const ModulesSchema = SchemaFactory.createForClass(Module);
