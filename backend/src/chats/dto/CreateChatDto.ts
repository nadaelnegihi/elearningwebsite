import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
export class CreateChatDto {

  @IsString()
  @IsNotEmpty()
  readonly conversationId: string;  // ID of the conversation or group chat

  @IsString()
  @IsNotEmpty()
  readonly message: string;  // The actual chat message

  @IsString()
  @IsOptional()
  readonly recipientId?: mongoose.Schema.Types.ObjectId;  // Optional: for direct messages between users

  @IsString()
  @IsOptional()
  readonly sender?: mongoose.Schema.Types.ObjectId;  // Optional: for direct messages between users
}
