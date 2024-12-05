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

  @Prop({  enum: ['Below Average', 'Average', 'Above Average'], default:'Below Average', required: function () {
    return this.role === 'student'; // Only for students
  }})
  level: string;

  @Prop({
    type: [{ course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, status: { type: String, enum: ['enrolled', 'completed'], default: 'enrolled' } }],
    required: function () {
      return this.role === 'student';
    },
  })
  studentCourses?: {
    course: mongoose.Types.ObjectId;
    status: string;
  }[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    required: function () {
      return this.role === 'instructor'; // Only required if the role is instructor
    },
  })
  teachingCourses?: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }],
    required: function () {
      return this.role === 'student'; // Only for students
    },
  })
  quizResponses?: mongoose.Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type:[Number],required: function () {
    return this.role === 'student'; // Only for students
  } })
  scores: number[];
 
}

export const UsersSchema = SchemaFactory.createForClass(User);
