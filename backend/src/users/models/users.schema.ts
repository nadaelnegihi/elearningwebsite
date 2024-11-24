import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  userId: mongoose.Schema.Types.ObjectId;

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

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(User);
