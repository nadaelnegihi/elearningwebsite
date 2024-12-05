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

  async submitQuiz(submitQuizDto: SubmitQuizDto): Promise<{ percentage: number; feedback: string }> {
    const { studentId, quizId, answers } = submitQuizDto;

    let score = 0;
    const feedback: string[] = [];

    for (const { questionId, selectedAnswer } of answers) {
      const question = await this.questionModel.findById(questionId);
      if (!question) {
        throw new NotFoundException(`Question with ID ${questionId} not found`);
      }

      if (question.correctAnswer === selectedAnswer) {
        score += 1;
        feedback.push(`Question ${questionId}: Correct`);
      } else {
        feedback.push(
          `Question ${questionId}: Incorrect. Review the module for this question's topic.`
        );
      }
    }

    // Calculate percentage
    const totalQuestions = answers.length;
    const percentage = (score / totalQuestions) * 100;

    // Store percentage score in user's scores array (only for students)
    const user = await this.userModel.findById(studentId);
    if (!user) {
      throw new NotFoundException(`User with ID ${studentId} not found`);
    }

    if (user.role === 'student') {
      user.scores.push(percentage); // Store percentage score
      await user.save();
    }

    // Real-time feedback based on performance
    const passingScore = totalQuestions * 0.5; // Assume 50% is passing
    const advice =
      score >= passingScore
        ? 'Well done! Keep progressing.'
        : 'You did not pass. Please review the module content and try again.';

    return {
      percentage,
      feedback: `${feedback.join('\n')}\n\n${advice}`,
    };
  }
}
