import mongoose from "mongoose";
export class CreateQuestionDto {
  moduleId: mongoose.Schema.Types.ObjectId; 
  questionId :string; 
  questionText: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes:'MCQ'|'True/False';
}