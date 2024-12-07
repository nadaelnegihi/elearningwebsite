import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  @Length(5, 500)
  content?: string; // Optional updated comment content
}
