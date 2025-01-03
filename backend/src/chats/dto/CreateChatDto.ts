import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateChatDto {

  @IsString()
  @IsOptional()
  readonly conversationId: string;  // ID of the conversation or group chat

  @IsString()
  @IsNotEmpty()
  readonly message: string;  // The actual chat message

  @IsString()
  @IsOptional()
  readonly recipientId?: mongoose.Schema.Types.ObjectId;  // Optional: for direct messages between users
}
