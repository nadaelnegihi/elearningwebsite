import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true }) // Enable timestamps
export class Module {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' })
  courseId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_level: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }], default: [] })
  resources: mongoose.Types.ObjectId[];

  @Prop({
    type: [
      {
        title: String,
        content: String,
        resources: [
          {
            contentType: String,
            resource: String,
            date: { type: Date, required: true, default: Date.now },
          },
        ],
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  versions: Array<{
    title: string;
    content: string;
    resources: { contentType: string; resource: string; date: Date }[];
    updatedAt: Date;
  }>;

  @Prop({ default: false })
  isOutdated: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }] })
  quizzes: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questionbank' }] })
  questions: mongoose.Types.ObjectId[];
  
  @Prop({ type: [Number], default: [] }) // Store individual ratings
  ratings: number[];
}

export const ModulesSchema = SchemaFactory.createForClass(Module);
