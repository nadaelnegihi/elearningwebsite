import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateForumPostDto {
  @IsString()
  @IsOptional()
  @Length(5, 100)
  title?: string; // Optional title update

  @IsString()
  @IsOptional()
  @Length(10, 1000)
  content?: string; // Optional content update
}
