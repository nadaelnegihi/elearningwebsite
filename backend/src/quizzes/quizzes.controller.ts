import { Controller, Get,Post,Req,Put,Delete, Param, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/CreateQuizDto';
import { CreateQuestionDto } from './dto/CreateQuestionDto';
import { QuestionDocument,Questionbank } from './models/questionbank.schema';
import mongoose from 'mongoose';
@Controller('quizzes')
export class QuizzesController {  
    constructor(private quizService: QuizzesService) {}

    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Instructor)
    @Post('questions')
    async createQuestion(@Body() createQuestionDto: CreateQuestionDto): Promise<Questionbank> {
      return this.quizService.createQuestion(createQuestionDto);
    }
    
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Instructor)
    @Post('create')
    async createQuiz(@Body() createQuizDto: CreateQuizDto, @Req() req: any) {
      const instructorId = req.user._id; // Extract the instructor's ID from the JWT
      return this.quizService.createQuiz(createQuizDto, instructorId);
    }
    
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Student, Role.Instructor)
    @Get(':moduleId') // Route to fetch quizzes by module
    async getQuizzesByModule(@Param('moduleId') moduleId: string) {
      const quizzes = await this.quizService.getQuizzesByModule(
        new mongoose.Types.ObjectId(moduleId)
      );
      return { quizzes };
    }
    
  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student, Role.Instructor)
  @Get('fetch/:quizId')
  async getQuizById(@Param('quizId') quizId: string) {
    const objectId = new mongoose.Types.ObjectId(quizId); // Convert `quizId` to ObjectId
    return this.quizService.getQuizById(objectId);
  }
  @UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Instructor)
@Put('questions/:questionId')
async updateQuestion(
  @Param('questionId') questionId: string,
  @Body() updateData: Partial<CreateQuestionDto>
) {
  return this.quizService.updateQuestion(questionId, updateData);
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Instructor)
@Delete('questions/:questionId')
async deleteQuestion(@Param('questionId') questionId: string) {
  await this.quizService.deleteQuestion(questionId);
  return { message: 'Question deleted successfully' };
}
}

