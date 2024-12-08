export class CreateQuizDto {
  moduleId: string;
  numberOfQuestions: number;
  questionTypes: 'MCQ'| 'True/False'| 'Both';
  studentId: string;
}