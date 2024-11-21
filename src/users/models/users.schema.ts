import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document,HydratedDocument } from 'mongoose';

@Schema() 
export class User extends Document{
    @Prop({ required: true, unique: true })
    user_id: string; 

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password_hash: string; 

    @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
    role: string; 

    @Prop({ required: true, default: Date.now })
    createdAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(User);
