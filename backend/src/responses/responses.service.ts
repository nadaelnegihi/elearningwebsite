import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Response, ResponseDocument } from './models/responses.schema';
import { SubmitQuizDto } from './dto/SubmitQuizDto';
import { Questionbank, QuestionDocument } from 'src/quizzes/models/questionbank.schema';
import { User, UserDocument } from 'src/users/models/users.schema';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(Response.name) private ResponseModel: mongoose.Model<ResponseDocument>,
    @InjectModel(Questionbank.name) private questionModel: mongoose.Model<QuestionDocument>,
    @InjectModel(User.name) private userModel: mongoose.Model<UserDocument>, // Inject user model
  ) {}

  async submitQuiz(
    quizId: mongoose.Types.ObjectId,
    submitQuizDto: Omit<SubmitQuizDto, 'quizId'>,
  ): Promise<{
    percentage: number;
    feedback: string[];
    detailedResults: { questionId: string; status: string; selectedAnswer: string; correctAnswer: string }[];
  }> {
    const { studentId, answers } = submitQuizDto;
  
    let score = 0;
    const feedback: string[] = [];
    const detailedResults: {
      questionId: string;
      status: string;
      selectedAnswer: string;
      correctAnswer: string;
    }[] = [];
  
    for (const { questionId, selectedAnswer } of answers) {
      // Query by `questionId` field
      const question = await this.questionModel.findOne({ questionId }).exec();
      if (!question) {
        throw new NotFoundException(`Question with ID ${questionId} not found`);
      }
  
      if (question.correctAnswer === selectedAnswer) {
        score += 1;
        feedback.push(`Question ${questionId}: Correct`);
        detailedResults.push({
          questionId,
          status: 'Correct',
          selectedAnswer,
          correctAnswer: question.correctAnswer,
        });
      } else {
        feedback.push(
          `Question ${questionId}: Incorrect. Review the module for this question's topic.`
        );
        detailedResults.push({
          questionId,
          status: 'Incorrect',
          selectedAnswer,
          correctAnswer: question.correctAnswer,
        });
      }
    }
  
    // Calculate percentage
    const totalQuestions = answers.length;
    const percentage = (score / totalQuestions) * 100;
  
    // Update user's scores array (only for students)
    const user = await this.userModel.findById(studentId);
    if (!user) {
      throw new NotFoundException(`User with ID ${studentId} not found`);
    }
  
    if (user.role === 'student') {
      user.scores.push(percentage); // Store the percentage score
      await user.save();
    }
  
    // Generate overall advice
    const passingScore = totalQuestions * 0.5; // 50% passing threshold
    const advice =
      score >= passingScore
        ? 'Well done! Keep progressing.'
        : 'You did not pass. Please review the module content and try again.';
  
    // Return detailed results, percentage, and advice
    return {
      percentage,
      feedback: [...feedback, advice], // High-level feedback
      detailedResults, // Detailed question feedback
    };
  }
}  