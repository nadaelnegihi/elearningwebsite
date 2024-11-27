import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>
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
    default: 'admin', // Default value for role
  })
  role: string;
   // Enrolled courses (for students)
   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
   enrolledCourses: mongoose.Types.ObjectId[];
 
   // Completed courses (for students)
   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
   completedCourses: mongoose.Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const UsersSchema = SchemaFactory.createForClass(User);
