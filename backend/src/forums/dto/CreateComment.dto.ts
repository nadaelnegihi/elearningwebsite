import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  content: string; // Comment content

  @IsString()
  @IsNotEmpty()
  forumPostId: string; // ID of the forum post the comment belongs to
}