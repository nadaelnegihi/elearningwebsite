import mongoose from "mongoose";

export class SubmitQuizDto {
    studentId: mongoose.Schema.Types.ObjectId;
    quizId: mongoose.Schema.Types.ObjectId;
    answers: { questionId: string; selectedAnswer: string }[];
  }
  