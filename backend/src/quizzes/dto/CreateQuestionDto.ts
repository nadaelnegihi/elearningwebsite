export class CreateQuestionDto {
  questionId :string; 
  questionText: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes:'MCQ'|'True/False';
}