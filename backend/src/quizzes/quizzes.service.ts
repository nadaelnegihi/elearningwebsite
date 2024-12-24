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
import { Module,ModuleDocument } from 'src/modules/models/modules.schema';
@Injectable()
export class QuizzesService {
  constructor( 
  @InjectModel(Questionbank.name) private  questionModel: mongoose.Model<QuestionDocument>,
  @InjectModel(Quiz.name) private quizModel: mongoose.Model<QuizDocument>,
  @InjectModel(User.name) private userModel: mongoose.Model<UserDocument>,
   @InjectModel(Module.name) private moduleModel: mongoose.Model<ModuleDocument>,
) {} 
async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Questionbank> {
  if (createQuestionDto.questionTypes === 'True/False') {
    createQuestionDto.options = ['True', 'False'];
  }
  const newQuestion = new this.questionModel(createQuestionDto);
  const savedQuestion = await newQuestion.save();

  // Use `_id` instead of `questionId`
  await this.moduleModel.findByIdAndUpdate(
    createQuestionDto.moduleId,
    { $push: { questions: savedQuestion._id } },
    { new: true }
  );

  return savedQuestion;
}


  // Method 1: Create a quiz and generate questions
  async createQuiz(createQuizDto: CreateQuizDto, instructorId: mongoose.Types.ObjectId) {
    const { moduleId, numberOfQuestions, questionTypes, studentId } = createQuizDto;
  
    // Handle "Both" by resolving it to ["MCQ", "True/False"]
    const resolvedQuestionTypes =
      questionTypes.includes("Both") ? ["MCQ", "True/False"] : questionTypes;
  
    // Fetch the instructor's name using their ID
    const instructor = await this.userModel.findById(instructorId).exec();
    if (!instructor) {
      throw new Error("Invalid instructor");
    }
  
    const createdBy = instructor.name;
  
    // Step 1: Create quiz document
    const quiz = new this.quizModel({
      moduleId,
      numberOfQuestions,
      questionTypes: resolvedQuestionTypes, // Save resolved types
      createdBy,
      questions: [],
    });
    await quiz.save();
  
    // Step 2: Generate questions and update the quiz
    const updatedQuiz = await this.generateQuestions(studentId, quiz._id as mongoose.Types.ObjectId);
  
    // Step 3: Add the quiz to the module's list of quizzes
    await this.moduleModel.findByIdAndUpdate(
      moduleId,
      { $push: { quizzes: quiz._id } }, // Add the quiz ID to the module's quizzes field
      { new: true }
    );
  
    return updatedQuiz;
  }
  
  async generateQuestions(studentId: string, quizId: mongoose.Types.ObjectId) {
    const student = await this.userModel.findById(studentId);
    if (!student || student.role !== 'student') {
      throw new NotFoundException('Student not found');
    }
  
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    const { level } = student;
    const difficulty = this.mapPerformanceToDifficulty(level);
  
    const questions = await this.questionModel.aggregate([
      {
        $match: {
          moduleId: quiz.moduleId,
          questionTypes: { $in: quiz.questionTypes },
          difficulty: { $in: difficulty },
        },
      },
      { $sample: { size: quiz.numberOfQuestions } },
    ]);
  
    if (questions.length < quiz.numberOfQuestions) {
      throw new NotFoundException('Not enough questions available to generate the quiz.');
    }
  
    quiz.questions = questions.map((q) => q._id); // Ensure `_id` consistency
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
  async getQuizzesByModule(moduleId: mongoose.Types.ObjectId): Promise<Quiz[]> {
    const module = await this.moduleModel
      .findById(moduleId)
      .populate('quizzes') // Populate quizzes from the module
      .exec();
  
    if (!module) {
      throw new NotFoundException('Module not found');
    }
  
    // TypeScript assumes 'quizzes' is still ObjectId[], so explicitly cast it
    return module.quizzes as unknown as Quiz[];
  }
  
  
  async getQuizById(quizId: mongoose.Types.ObjectId): Promise<Quiz> {
    const quiz = await this.quizModel
      .findById(quizId)
      .populate({
        path: 'questions',
        model: 'Questionbank', // Replace with your question model name
      })
      .exec();
  
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    return quiz;
  }
  
  async updateQuestion(
    questionId: string,
    updateData: Partial<CreateQuestionDto>
  ): Promise<Questionbank> {
    const question = await this.questionModel.findByIdAndUpdate(
      questionId,
      { $set: updateData },
      { new: true } // Return the updated question
    );
  
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }
  
  async deleteQuestion(questionId: string): Promise<void> {
    const question = await this.questionModel.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
  
    // Soft delete: Add a `deleted` flag instead of actual deletion
    await this.questionModel.findByIdAndUpdate(questionId, { $set: { deleted: true } });
  }
  
}