import { Injectable, ForbiddenException ,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Quiz } from './models/quizzes.schema';
import { CreateQuizDto } from './dto/CreateQuizDto';
import { User } from 'src/users/models/users.schema'; 
import { Questionbank,QuestionDocument } from './models/questionbank.schema';
import { QuizDocument } from './models/quizzes.schema';
import { CreateQuestionDto } from './dto/CreateQuestionDto';
import { UserDocument } from 'src/users/models/users.schema';
@Injectable()
export class QuizzesService {
  constructor( 
  @InjectModel(Questionbank.name) private  questionModel: mongoose.Model<QuestionDocument>,
  @InjectModel(Quiz.name) private quizModel: mongoose.Model<QuizDocument>,
  @InjectModel(User.name) private userModel: mongoose.Model<UserDocument>,
) {} 
async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Questionbank> {
  const newQuestion = new this.questionModel(createQuestionDto);
  return newQuestion.save();
}
  // Method 1: Create a quiz and generate questions
  async createQuiz(createQuizDto: CreateQuizDto) {
    const { moduleId, numQuestions, questionTypes, createdBy, studentId } = createQuizDto;

    // Step 1: Create quiz document
    const quiz = new this.quizModel({
      moduleId,
      numQuestions,
      questionTypes,
      createdBy,
      questions: [],
    });
    await quiz.save();

    // Step 2: Generate questions and update the quiz
    const updatedQuiz = await this.generateQuestions(studentId, quiz.quizId);
    return updatedQuiz;
  }

  // Method 2: Generate questions based on student performance
  async generateQuestions(studentId: string, quizId: string) {
    const student = await this.userModel.findById(studentId);
    if (!student || student.role !== 'student') {
      throw new NotFoundException('Student not found');
    }

    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const { level } = student; // Determine student's performance level
    const difficulty = this.mapPerformanceToDifficulty(level);

    const questions = await this.questionModel.aggregate([
      { $match: { moduleId: quiz.moduleId, questionTypes: { $in: quiz.questionTypes }, difficulty: { $in: difficulty } } },
      { $sample: { size: quiz.numberOfQuestions } }, // Randomly select questions
    ]);

    quiz.questions = questions.map((q) => q._id);
    await quiz.save();

    return quiz;
  }

  private mapPerformanceToDifficulty(level: string): string[] {
    switch (level) {
      case 'Below Average':
        return ['easy'];
      case 'Average':
        return ['easy', 'medium'];
      case 'Above Average':
        return ['medium', 'hard'];
      default:
        return ['medium'];
    }
  }
  async getAllQuizzes(): Promise<Quiz[]> {
    return this.quizModel.find().exec(); // Retrieve all quizzes
  }
  
  async getQuizById(quizId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ quizId }).exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }
}