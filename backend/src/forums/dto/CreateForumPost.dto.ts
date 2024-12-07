import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateForumPostDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  title: string; // Forum post title with a length limit

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  content: string; // Forum post content
}
