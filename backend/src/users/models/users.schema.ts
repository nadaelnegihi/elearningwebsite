import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['student', 'instructor', 'admin'],
    default: 'admin',
  })
  role: string;

  @Prop({
    enum: ['Below Average', 'Average', 'Above Average'],
    required: false, // Required logic handled in pre-save hook
  })
  level?: string;

  @Prop({
    type: [{ 
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, 
      status: { type: String, enum: ['enrolled', 'completed'], default: 'enrolled' } 
    }],
    required: false, // Required logic handled in pre-save hook
  })
  studentCourses?: {
    course: mongoose.Types.ObjectId;
    status: string;
  }[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    required: false, // Required logic handled in pre-save hook
  })
  teachingCourses?: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }],
    required: false, // Required logic handled in pre-save hook
  })
  quizResponses?: mongoose.Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    type: [Number],
    required: false, // Required logic handled in pre-save hook
  })
  scores?: number[];

  @Prop({
    type: [Number],
    default: [],
    required: false, // Required logic handled in pre-save hook
  })
  ratings?: number[];
}

export const UsersSchema = SchemaFactory.createForClass(User);

// Pre-save hook to conditionally remove fields
UsersSchema.pre<UserDocument>('save', function (next) {
  if (this.role === 'student') {
    this.teachingCourses = undefined;
    this.ratings = undefined;
  } else if (this.role === 'instructor') {
    this.level = undefined;
    this.studentCourses = undefined;
    this.quizResponses = undefined;
    this.scores = undefined;
  } else if (this.role === 'admin') {
    this.level = undefined;
    this.studentCourses = undefined;
    this.quizResponses = undefined;
    this.scores = undefined;
    this.teachingCourses = undefined;
    this.ratings = undefined;
  }
  next();
});
UsersSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.role === 'student') {
      delete ret.teachingCourses;
      delete ret.ratings;
    } else if (ret.role === 'instructor') {
      delete ret.level;
      delete ret.studentCourses;
      delete ret.quizResponses;
      delete ret.scores;
    } else if (ret.role === 'admin') {
      delete ret.level;
      delete ret.studentCourses;
      delete ret.quizResponses;
      delete ret.scores;
      delete ret.teachingCourses;
      delete ret.ratings;
    }
    return ret;
  },
});

