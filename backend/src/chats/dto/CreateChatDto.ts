import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  readonly conversationId: string;  // ID of the conversation or group chat

  @IsString()
  @IsNotEmpty()
  readonly message: string;  // The actual chat message

  @IsString()
  @IsOptional()
  readonly recipientId?: string;  // Optional: for direct messages between users
}
