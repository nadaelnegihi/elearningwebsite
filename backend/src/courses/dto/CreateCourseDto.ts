export class CreateCourseDto {
    title: string;
    description: string;
    category: string;
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
    
  }
  