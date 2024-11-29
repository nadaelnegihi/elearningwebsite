export class CreateQuestionDto {
    questionText: string;
    options: string[];
    correctAnswer: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }